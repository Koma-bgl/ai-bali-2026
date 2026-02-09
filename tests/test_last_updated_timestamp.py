import pytest
from playwright.sync_api import Page, expect

def test_last_updated_text_present(page: Page, base_url: str):
    """Verify that the exact string 'Last updated: Today' is present on the homepage."""
    page.goto(base_url)
    expect(page.locator("text=Last updated: Today")).to_be_visible()

def test_last_updated_text_position(page: Page, base_url: str):
    """Ensure the text is at the bottom of the viewport."""
    page.goto(base_url)
    footer = page.locator("text=Last updated: Today")
    expect(footer).to_be_visible()
    # Check if the footer is at the bottom of the viewport
    viewport_height = page.viewport_size["height"]
    footer_bounding_box = footer.bounding_box()
    assert footer_bounding_box["y"] + footer_bounding_box["height"] >= viewport_height - 50  # Allow some margin