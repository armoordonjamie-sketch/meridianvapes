"""Tests for the compliance filter and the InvenTree to public mapping."""

from app.mapping import transform_inventree
from app.models import PublicProduct

from .fixtures import SAMPLE_PARAMETERS, SAMPLE_PARTS


def test_only_compliant_product_is_returned(settings):
    """One compliant, one non-notified, one disposable -> only compliant kept."""
    catalogue = transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings)

    assert len(catalogue) == 1
    product = catalogue[0]
    assert product.id == "10"
    assert product.name == "Aurora Refillable Pod Kit"
    assert product.mhra_notified is True


def test_non_notified_part_is_excluded(settings):
    catalogue = transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings)
    assert all(p.id != "20" for p in catalogue)


def test_disposable_is_excluded_even_when_notified(settings):
    """Part 30 is mhra_notified true AND is_disposable true; must be dropped."""
    catalogue = transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings)
    assert all(p.id != "30" for p in catalogue)


def test_compliant_product_is_mapped_correctly(settings):
    product = transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings)[0]

    assert product.slug == "aurora-refillable-pod-kit"
    assert product.category == "pod-kits"
    assert product.price_gbp == 24.99
    assert product.stock_level == 12
    assert product.in_stock is True
    assert product.image_url == "https://www.meridianvapes.co.uk/img/aurora.webp"
    assert product.description.startswith("Refillable pod system")


def test_public_model_carries_no_promotional_fields():
    """The public shape is exactly the agreed factual fields, nothing more."""
    expected = {
        "id",
        "slug",
        "name",
        "category",
        "price_gbp",
        "in_stock",
        "stock_level",
        "description",
        "image_url",
        "mhra_notified",
    }
    assert set(PublicProduct.model_fields) == expected

    banned = {"discount", "offer", "savings", "best", "countdown", "sale", "rrp"}
    assert banned.isdisjoint(PublicProduct.model_fields)


def test_internal_inventree_image_path_is_never_exposed(settings):
    """image_url comes from a public parameter, never InvenTree's media path."""
    product = transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings)[0]
    assert "/media/" not in (product.image_url or "")


def test_empty_input_yields_empty_catalogue(settings):
    assert transform_inventree([], [], settings) == []
