import pytest
from playwright.sync_api import Page, expect

def test_last_updated_text_present(page: Page, base_url: str):
    page.goto(base_url)
    expect(page.locator("div.text-gray-500")).to_have_text("Last updated: Today")

def test_last_updated_at_bottom(page: Page, base_url: str):
    page.goto(base_url)
    footer = page.locator("div.text-gray-500")
    viewport_height = page.viewport_size["height"]
    footer_bottom = footer.bounding_box()["y"] + footer.bounding_box()["height"]
    assert abs(viewport_height - footer_bottom) < 50, "Footer is not at the bottom of the viewport"