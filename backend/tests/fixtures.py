"""Mocked InvenTree responses used by the tests.

Three parts that exercise the compliance filter:
  - part 10: compliant      (mhra_notified true,  is_disposable false)  -> kept
  - part 20: not notified    (mhra_notified false, is_disposable false)  -> dropped
  - part 30: disposable      (mhra_notified true,  is_disposable true)   -> dropped

The disposable part is also notified, which proves the disposable exclusion
wins regardless of notification status.
"""

# Shape mirrors GET /api/part/?category_detail=true
SAMPLE_PARTS = [
    {
        "pk": 10,
        "name": "Aurora Refillable Pod Kit",
        "description": "Refillable pod system with a 2ml pod and USB-C charging.",
        "active": True,
        "in_stock": 12,
        "category_detail": {"pk": 1, "name": "Pod Kits"},
        "image": "/media/part_images/internal-only.png",
    },
    {
        "pk": 20,
        "name": "Unverified Mod Kit",
        "description": "A device that has not completed MHRA notification.",
        "active": True,
        "in_stock": 5,
        "category_detail": {"pk": 2, "name": "Pod Kits"},
        "image": "/media/part_images/internal-only-2.png",
    },
    {
        "pk": 30,
        "name": "Single Use Disposable",
        "description": "A single use disposable device.",
        "active": True,
        "in_stock": 50,
        "category_detail": {"pk": 3, "name": "Disposables"},
        "image": "/media/part_images/internal-only-3.png",
    },
]

# Shape mirrors GET /api/part/parameter/ with template_detail expanded.
SAMPLE_PARAMETERS = [
    # part 10 - compliant
    {"pk": 1, "part": 10, "template_detail": {"pk": 1, "name": "mhra_notified"}, "data": "true"},
    {"pk": 2, "part": 10, "template_detail": {"pk": 2, "name": "is_disposable"}, "data": "false"},
    {"pk": 3, "part": 10, "template_detail": {"pk": 3, "name": "price_gbp"}, "data": "24.99"},
    {"pk": 4, "part": 10, "template_detail": {"pk": 4, "name": "slug"}, "data": "aurora-refillable-pod-kit"},
    {
        "pk": 5,
        "part": 10,
        "template_detail": {"pk": 5, "name": "image_url"},
        "data": "https://www.meridianvapes.co.uk/img/aurora.webp",
    },
    # part 20 - not notified
    {"pk": 6, "part": 20, "template_detail": {"pk": 1, "name": "mhra_notified"}, "data": "false"},
    {"pk": 7, "part": 20, "template_detail": {"pk": 2, "name": "is_disposable"}, "data": "false"},
    {"pk": 8, "part": 20, "template_detail": {"pk": 3, "name": "price_gbp"}, "data": "19.99"},
    # part 30 - disposable (also notified, to prove disposable exclusion wins)
    {"pk": 9, "part": 30, "template_detail": {"pk": 1, "name": "mhra_notified"}, "data": "true"},
    {"pk": 10, "part": 30, "template_detail": {"pk": 2, "name": "is_disposable"}, "data": "true"},
    {"pk": 11, "part": 30, "template_detail": {"pk": 3, "name": "price_gbp"}, "data": "5.99"},
]
