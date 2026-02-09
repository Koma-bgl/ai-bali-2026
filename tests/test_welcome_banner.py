import pytest
from playwright.sync_api import Page, expect

def test_welcome_banner_text(page: Page, base_url: str):
    # Test Case 1: Navigation to the homepage should show the text "Welcome back, User!"
    page.goto(base_url)
    welcome_banner = page.locator("div:has-text('Welcome back, User!')")
    expect(welcome_banner).to_have_text("Welcome back, User!")

def test_welcome_banner_visibility(page: Page, base_url: str):
    # Test Case 2: The element containing the welcome text should be visible and not hidden behind other elements
    page.goto(base_url)
    welcome_banner = page.locator("div:has-text('Welcome back, User!')")
    expect(welcome_banner).to_be_visible()
    # Additional check to ensure it's not hidden behind other elements
    expect(welcome_banner).to_have_css("opacity", "1")
    expect(welcome_banner).to_have_css("visibility", "visible")
