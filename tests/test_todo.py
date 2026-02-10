import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_add_todo_item(page: Page, base_url: str):
    page.goto(base_url)
    percy_snapshot(page, name="test_add_todo_item_initial")

    # Verify the "+ Add Todo" button is visible
    add_button = page.get_by_test_id("add-todo-button")
    expect(add_button).to_be_visible()
    expect(add_button).to_have_text("+ Add Todo")

    # Click the "+ Add Todo" button
    add_button.click()

    # Verify the input field is visible
    input_field = page.get_by_test_id("add-todo-input")
    expect(input_field).to_be_visible()

    # Enter text into the input field
    input_field.fill("Buy groceries")

    # Submit the form
    submit_button = page.get_by_test_id("add-todo-submit")
    expect(submit_button).to_be_enabled()
    submit_button.click()

    # Verify the input field is cleared and hidden after submission
    expect(input_field).not_to_be_visible()

    # Verify the new todo item appears in the list
    # Check the text content of the todo item label. The label contains sr-only text
    todo_item_label = page.locator("li label")
    expect(todo_item_label).to_contain_text("Buy groceries")

    # Verify the "+ Add Todo" button reappears
    expect(add_button).to_be_visible()
    percy_snapshot(page, name="test_add_todo_item_after_submit")


def test_add_empty_todo_item_validation(page: Page, base_url: str):
    page.goto(base_url)

    # Click the "+ Add Todo" button
    add_button = page.get_by_test_id("add-todo-button")
    add_button.click()

    # Verify the input field is visible
    input_field = page.get_by_test_id("add-todo-input")
    expect(input_field).to_be_visible()

    # Attempt to submit the empty form
    submit_button = page.get_by_test_id("add-todo-submit")
    expect(submit_button).to_be_disabled()

    # The error message would appear only if submit_button was enabled, not by just clicking it when disabled
    # Therefore we check that the error message paragraph does not exist.

    # Press Enter key on the input field, which should trigger form validation
    input_field.press("Enter")

    # Verify the error message is displayed
    error_message = page.locator(".text-red-500")
    expect(error_message).to_be_visible()
    expect(error_message).to_have_text("Todo item cannot be empty")

    # Close the input by pressing Escape
    input_field.press("Escape")
    expect(input_field).not_to_be_visible()


def test_cancel_add_todo_item(page: Page, base_url: str):
    page.goto(base_url)

    # Click the "+ Add Todo" button
    add_button = page.get_by_test_id("add-todo-button")
    add_button.click()

    # Verify the input field is visible
    input_field = page.get_by_test_id("add-todo-input")
    expect(input_field).to_be_visible()

    # Enter text into the input field
    input_field.fill("Grocery")

    # Click the cancel button
    cancel_button = page.get_by_test_id("add-todo-cancel")
    cancel_button.click()

    # Verify the input field is hidden again
    expect(input_field).not_to_be_visible()

    # Verify the add button is visible again
    expect(add_button).to_be_visible()
