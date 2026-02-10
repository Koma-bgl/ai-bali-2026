import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_welcome_banner_text(page: Page, base_url: str):
    """Test that the welcome banner text is displayed on the homepage."""
    page.goto(base_url)
    welcome_banner = page.locator("div:has-text('Welcome back, User!')")
    expect(welcome_banner).to_have_text("Welcome back, User!")
    percy_snapshot(page, name="test_welcome_banner_text_after_load")

def test_welcome_banner_visibility(page: Page, base_url: str):
    """Test that the welcome banner is visible and not hidden."""
    page.goto(base_url)
    welcome_banner = page.locator("div:has-text('Welcome back, User!')")
    expect(welcome_banner).to_be_visible()
    percy_snapshot(page, name="test_welcome_banner_visibility_after_load")