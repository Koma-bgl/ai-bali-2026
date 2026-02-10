
import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot


def test_add_todo_button_visibility(page: Page, base_url: str):
    # Navigate to the home page
    page.goto(base_url)

    # Verify the "+ Add Todo" button is visible
    add_todo_button = page.get_by_test_id("add-todo-button")
    expect(add_todo_button).to_be_visible()
    expect(add_todo_button).to_have_text("+ Add Todo")
    percy_snapshot(page, name="test_add_todo_button_visibility")


def test_add_todo_button_click_opens_input(page: Page, base_url: str):
    # Navigate to the home page
    page.goto(base_url)

    # Click the "+ Add Todo" button
    add_todo_button = page.get_by_test_id("add-todo-button")
    add_todo_button.click()

    # Verify the input field is visible
    add_todo_input = page.get_by_test_id("add-todo-input")
    expect(add_todo_input).to_be_visible()
    percy_snapshot(page, name="test_add_todo_button_click_opens_input")


def test_add_todo_submission(page: Page, base_url: str):
    # Navigate to the home page
    page.goto(base_url)

    # Click the "+ Add Todo" button
    add_todo_button = page.get_by_test_id("add-todo-button")
    add_todo_button.click()

    # Enter text into the input field
    add_todo_input = page.get_by_test_id("add-todo-input")
    todo_text = "Buy groceries"
    add_todo_input.fill(todo_text)

    # Submit the form by pressing Enter
    add_todo_input.press("Enter")

    # Verify the new todo item appears in the list
    todo_list = page.get_by_test_id("todo-list")
    expect(todo_list).to_be_visible()
    todo_item = page.get_by_test_id("todo-item")
    expect(todo_item).to_be_visible()

    todo_text_element = page.get_by_test_id("todo-text").first
    expect(todo_text_element).to_contain_text(todo_text)  # Use to_contain_text due to sr-only span

    # Verify the input field is cleared
    expect(add_todo_input).to_be_empty()

    percy_snapshot(page, name="test_add_todo_submission")


def test_empty_todo_validation(page: Page, base_url: str):
    # Navigate to the home page
    page.goto(base_url)

    # Click the "+ Add Todo" button
    add_todo_button = page.get_by_test_id("add-todo-button")
    add_todo_button.click()

    # Attempt to submit the form without entering any text via Enter keypress
    add_todo_input = page.get_by_test_id("add-todo-input")
    add_todo_input.press("Enter")

    # Verify that an error message is displayed.
    error_message = page.get_by_test_id("todo-error-message")
    expect(error_message).to_be_visible()
    expect(error_message).to_have_text("Todo item cannot be empty")
    percy_snapshot(page, name="test_empty_todo_validation")


def test_cancel_add_todo(page: Page, base_url: str):
    # Navigate to the home page
    page.goto(base_url)

    # Click the "+ Add Todo" button
    add_todo_button = page.get_by_test_id("add-todo-button")
    add_todo_button.click()

    # Click the "Cancel" button
    cancel_button = page.get_by_test_id("cancel-todo-button")
    cancel_button.click()

    # Verify the input field is hidden
    add_todo_input = page.get_by_test_id("add-todo-input")
    expect(add_todo_input).not_to_be_visible()

    # Verify the "+ Add Todo" button is visible again
    expect(add_todo_button).to_be_visible()
    percy_snapshot(page, name="test_cancel_add_todo")


def test_submit_button_disabled_on_empty_input(page: Page, base_url: str):
    page.goto(base_url)
    add_todo_button = page.get_by_test_id("add-todo-button")
    add_todo_button.click()
    submit_button = page.get_by_test_id("submit-todo-button")
    expect(submit_button).to_be_disabled()  # Submit button should be disabled

    # Enter some text to enable the button
    add_todo_input = page.get_by_test_id("add-todo-input")
    add_todo_input.fill("Test todo")
    expect(submit_button).to_be_enabled()  # Submit button should be enabled
    percy_snapshot(page, name="test_submit_button_disabled_on_empty_input")
