import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_welcome_banner_text(page: Page, base_url: str):
    # Navigate to the homepage
    page.goto(base_url)
    percy_snapshot(page, name="homepage")

    # Verify the welcome banner text is present
    welcome_banner = page.locator("div.w-full.bg-indigo-600.text-white.p-4.text-center.font-bold")
    expect(welcome_banner).to_have_text("Welcome back, User!")

def test_welcome_banner_visibility(page: Page, base_url: str):
    # Navigate to the homepage
    page.goto(base_url)

    # Verify the welcome banner is visible and not hidden
    welcome_banner = page.locator("div.w-full.bg-indigo-600.text-white.p-4.text-center.font-bold")
    expect(welcome_banner).to_be_visible()