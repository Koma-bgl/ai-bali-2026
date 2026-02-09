import pytest
from playwright.sync_api import Page, expect

def test_welcome_banner_text(page: Page, base_url: str):
    """Test that the welcome banner displays the correct text."""
    page.goto(base_url)
    welcome_banner = page.locator("div:has-text('Welcome back, User!')")
    expect(welcome_banner).to_have_text("Welcome back, User!")

def test_welcome_banner_visibility(page: Page, base_url: str):
    """Test that the welcome banner is visible and styled correctly."""
    page.goto(base_url)
    welcome_banner = page.locator("div:has-text('Welcome back, User!')")
    expect(welcome_banner).to_be_visible()
    expect(welcome_banner).to_have_class("w-full bg-indigo-600 text-white p-4 text-center font-bold")