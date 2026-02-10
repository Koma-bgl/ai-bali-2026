import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_add_todo_button_visibility(page: Page, base_url: str):
    page.goto(base_url)
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    percy_snapshot(page, name="add_todo_button_visible")

def test_add_todo_button_click_reveals_input(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).to_be_visible()
    percy_snapshot(page, name="add_todo_input_revealed")

def test_add_todo_item(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    input_field = page.get_by_test_id("add-todo-input")
    input_field.fill("Buy groceries")
    input_field.press("Enter")
    expect(page.get_by_test_id("todo-container")).to_contain_text("Buy groceries")
    expect(input_field).to_be_empty()
    percy_snapshot(page, name="add_todo_item_success")

def test_add_empty_todo_item_shows_error(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    input_field = page.get_by_test_id("add-todo-input")
    input_field.press("Enter")
    expect(page.locator(".text-red-500")).to_have_text("Todo item cannot be empty")
    percy_snapshot(page, name="add_empty_todo_item_error")

def test_cancel_add_todo(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_role("button", name="Cancel").click()
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    percy_snapshot(page, name="cancel_add_todo")

def test_escape_key_cancels_add_todo(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    input_field = page.get_by_test_id("add-todo-input")
    input_field.press("Escape")
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    percy_snapshot(page, name="escape_key_cancels")

def test_submit_button_disabled_during_submission(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    input_field = page.get_by_test_id("add-todo-input")
    input_field.fill("Test")
    submit_button = page.get_by_role("button", name="Submit")
    expect(submit_button).to_be_disabled()
