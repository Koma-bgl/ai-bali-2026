import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_todo_button_visibility(page: Page, base_url: str):
    """Test that the Todo button is visible on the main page."""
    page.goto(base_url)
    expect(page.get_by_role("button", name="+ Add Todo")).to_be_visible()
    percy_snapshot(page, name="test_todo_button_visibility_after_load")

def test_todo_button_click_opens_input(page: Page, base_url: str):
    """Test that clicking the Todo button opens an input field."""
    page.goto(base_url)
    page.get_by_role("button", name="+ Add Todo").click()
    expect(page.get_by_role("textbox")).to_be_visible()
    percy_snapshot(page, name="test_todo_button_click_opens_input_after_click")

def test_todo_button_adds_item(page: Page, base_url: str):
    """Test that the Todo button adds a new item to the list."""
    page.goto(base_url)
    page.get_by_role("button", name="+ Add Todo").click()
    page.get_by_role("textbox").fill("New Todo Item")
    page.get_by_role("button", name="Submit").click()
    expect(page.get_by_text("New Todo Item")).to_be_visible()
    percy_snapshot(page, name="test_todo_button_adds_item_after_submit")

def test_todo_button_empty_submission(page: Page, base_url: str):
    """Test that submitting an empty todo item shows a validation message."""
    page.goto(base_url)
    page.get_by_role("button", name="+ Add Todo").click()
    page.get_by_role("button", name="Submit").click()
    expect(page.get_by_text("Todo item cannot be empty")).to_be_visible()
    percy_snapshot(page, name="test_todo_button_empty_submission_after_click")
