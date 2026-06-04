"""Map raw InvenTree parts and parameters to the public product shape.

This module is pure: it takes the JSON InvenTree returns and produces a list of
PublicProduct. The compliance filter lives here too, so it can be tested in
isolation with a mocked InvenTree response:

    only items where mhra_notified is true AND is_disposable is false.
"""

from __future__ import annotations

import re

from .config import Settings
from .logging_config import get_logger
from .models import PublicProduct

logger = get_logger(__name__)

_TRUE_TOKENS = {"1", "true", "yes", "y", "on", "t"}
_SLUG_STRIP = re.compile(r"[^a-z0-9]+")


def parse_bool(value: object) -> bool:
    """Parse an InvenTree parameter value into a bool.

    Parameter data arrives as a string. Anything not clearly truthy is false,
    which is the safe default for a compliance flag like mhra_notified.
    """
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in _TRUE_TOKENS


def parse_price(value: object) -> float:
    """Parse a price into a non-negative float of GBP, defaulting to 0.0."""
    if value is None:
        return 0.0
    try:
        price = float(str(value).strip())
    except (TypeError, ValueError):
        return 0.0
    return price if price >= 0 else 0.0


def slugify(text: str) -> str:
    """Lowercase, hyphenated slug with non-alphanumerics collapsed."""
    return _SLUG_STRIP.sub("-", text.strip().lower()).strip("-")


def build_parameter_index(parameters: list[dict]) -> dict[int, dict[str, str]]:
    """Group parameters by part id into {part_id: {lower_template_name: data}}."""
    index: dict[int, dict[str, str]] = {}
    for param in parameters:
        part_id = param.get("part")
        template = param.get("template_detail") or {}
        name = template.get("name")
        if part_id is None or not name:
            continue
        data = param.get("data")
        index.setdefault(part_id, {})[str(name).strip().lower()] = data
    return index


def _category_slug(part: dict, params: dict[str, str], settings: Settings) -> str:
    """Derive the public category slug for a part."""
    override = params.get(settings.param_category.lower())
    if override:
        return slugify(str(override))
    category_detail = part.get("category_detail") or {}
    name = category_detail.get("name")
    if name:
        return slugify(str(name))
    return "uncategorised"


def map_part(part: dict, params: dict[str, str], settings: Settings) -> tuple[PublicProduct, bool]:
    """Map one InvenTree part to (PublicProduct, is_disposable).

    is_disposable is returned alongside the product because it is needed by the
    filter but must never appear in the public shape.
    """
    def param(name: str) -> object:
        return params.get(name.lower())

    mhra_notified = parse_bool(param(settings.param_mhra_notified))
    is_disposable = parse_bool(param(settings.param_is_disposable))

    name = str(part.get("name", "")).strip()
    slug_value = param(settings.param_slug)
    slug = slugify(str(slug_value)) if slug_value else slugify(name)

    # Price: prefer the explicit parameter, fall back to InvenTree pricing.
    price_raw = param(settings.param_price_gbp)
    if price_raw is None:
        price_raw = part.get("pricing_max") or part.get("pricing_min")
    price_gbp = parse_price(price_raw)

    stock_level = int(round(parse_price(part.get("in_stock"))))

    # image_url must be a publicly reachable URL. We deliberately never expose
    # InvenTree's internal media path, so part["image"] is ignored.
    image_value = param(settings.param_image_url)
    image_url = str(image_value).strip() if image_value else None

    product = PublicProduct(
        id=str(part.get("pk")),
        slug=slug,
        name=name,
        category=_category_slug(part, params, settings),
        price_gbp=price_gbp,
        in_stock=stock_level > 0,
        stock_level=stock_level,
        description=str(part.get("description") or "").strip(),
        image_url=image_url or None,
        mhra_notified=mhra_notified,
    )
    return product, is_disposable


def transform_inventree(
    parts: list[dict],
    parameters: list[dict],
    settings: Settings,
) -> list[PublicProduct]:
    """Map and filter raw InvenTree data into the public catalogue.

    Only compliant products are returned: mhra_notified true and is_disposable
    false. Disposables are excluded by design.
    """
    index = build_parameter_index(parameters)
    catalogue: list[PublicProduct] = []
    excluded_disposable = 0
    excluded_not_notified = 0

    for part in parts:
        params = index.get(part.get("pk"), {})
        product, is_disposable = map_part(part, params, settings)

        if is_disposable:
            excluded_disposable += 1
            continue
        if not product.mhra_notified:
            excluded_not_notified += 1
            continue
        catalogue.append(product)

    logger.info(
        "catalogue mapped",
        extra={
            "kept": len(catalogue),
            "excluded_disposable": excluded_disposable,
            "excluded_not_notified": excluded_not_notified,
            "source_parts": len(parts),
        },
    )
    return catalogue
