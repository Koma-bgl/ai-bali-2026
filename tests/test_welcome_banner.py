import pytest
from playwright.sync_api import Page, expect

def test_welcome_banner_text(page: Page, base_url: str):
    """Test that the welcome banner text is displayed correctly."""
    page.goto(base_url)
    welcome_banner = page.locator("text=Welcome back, User!")
    expect(welcome_banner).to_be_visible()
    expect(welcome_banner).to_have_text("Welcome back, User!")
    expect(welcome_banner).to_have_class("w-full bg-indigo-600 text-white p-4 text-center font-bold")

def test_welcome_banner_visibility(page: Page, base_url: str):
    """Test that the welcome banner is not hidden behind other elements."""
    page.goto(base_url)
    welcome_banner = page.locator("text=Welcome back, User!")
    # Check banner is at the top of the page
    expect(welcome_banner).to_be_in_viewport()
    # Check banner is not obscured
    expect(welcome_banner).not_to_be_hidden()