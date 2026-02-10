
import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_add_todo_button_functionality(page: Page, base_url: str):
    # Note: base_url will point to http://127.0.0.1:None
    page.goto(base_url)
    percy_snapshot(page, name="test_add_todo_initial")

    add_button = page.locator("button[aria-label='Add Todo']")
    expect(add_button).to_be_visible()
    expect(add_button).to_have_text("+ Add Todo")

    add_button.click()
    percy_snapshot(page, name="test_add_todo_input_visible")

    input_field = page.locator("input[placeholder='Enter todo text (minimum 1 character)']")
    expect(input_field).to_be_visible()

    submit_button = page.locator("button[aria-label='Submit todo']")
    cancel_button = page.locator("button[aria-label='Cancel todo']")

    expect(submit_button).to_be_disabled()

    input_field.fill("My new todo")
    expect(submit_button).to_be_enabled()

    submit_button.click()
    percy_snapshot(page, name="test_add_todo_submitted")

    expect(input_field).not_to_be_visible()
    expect(page.locator(".todo-item").first).to_contain_text("My new todo")

    expect(cancel_button).not_to_be_visible() # After submit, should not be visible

    # Add another todo
    add_button.click()
    input_field = page.locator("input[placeholder='Enter todo text (minimum 1 character)']")
    input_field.fill("Another todo")
    submit_button = page.locator("button[aria-label='Submit todo']")
    submit_button.click()
    expect(page.locator(".todo-item").first).to_contain_text("Another todo")

def test_add_todo_empty_validation(page: Page, base_url: str):
    page.goto(base_url)
    add_button = page.locator("button[aria-label='Add Todo']")
    add_button.click()
    input_field = page.locator("input[placeholder='Enter todo text (minimum 1 character)']")
    submit_button = page.locator("button[aria-label='Submit todo']")
    expect(submit_button).to_be_disabled()

    input_field.press("Enter")
    error_message = page.locator(".error-message")
    expect(error_message).to_be_visible()
    expect(error_message).to_have_text("Todo item cannot be empty")

    input_field.fill(" ")  # Fill with spaces
    input_field.press("Enter")
    expect(error_message).to_be_visible()
    expect(error_message).to_have_text("Todo item cannot be empty")

def test_add_todo_cancel_button(page: Page, base_url: str):
    page.goto(base_url)
    add_button = page.locator("button[aria-label='Add Todo']")
    add_button.click()
    input_field = page.locator("input[placeholder='Enter todo text (minimum 1 character)']")
    cancel_button = page.locator("button[aria-label='Cancel todo']")

    expect(input_field).to_be_visible()
    cancel_button.click()
    expect(input_field).not_to_be_visible()
    expect(add_button).to_be_focused()

def test_add_todo_escape_key(page: Page, base_url: str):
    page.goto(base_url)
    add_button = page.locator("button[aria-label='Add Todo']")
    add_button.click()
    input_field = page.locator("input[placeholder='Enter todo text (minimum 1 character)']")

    expect(input_field).to_be_visible()
    input_field.press("Escape")
    expect(input_field).not_to_be_visible()
    expect(add_button).to_be_focused()

def test_todo_item_character_limit(page: Page, base_url: str):
    page.goto(base_url)
    add_button = page.locator("button[aria-label='Add Todo']")
    add_button.click()
    input_field = page.locator("input[placeholder='Enter todo text (minimum 1 character)']")
    input_field.fill("A" * 105)
    expect(input_field).to_have_value("A" * 100) # Check if the value is truncated
