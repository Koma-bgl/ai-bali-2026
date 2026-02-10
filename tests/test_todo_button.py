import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_add_todo_button_functionality(page: Page, base_url: str) -> None:
    page.goto(base_url)
    percy_snapshot(page, name="test_add_todo_button_after_load")

    add_button = page.locator("[data-testid=add-todo-button]")
    expect(add_button).to_be_visible()
    expect(add_button).to_have_text("+ Add Todo")

    add_button.click()
    input_field = page.locator("[data-testid=add-todo-input]")
    expect(input_field).to_be_visible()

    input_field.fill("Buy groceries")
    submit_button = page.locator("[data-testid=submit-todo-button]")
    expect(submit_button).to_be_visible()
    submit_button.click()

    todo_list = page.locator("[data-testid=todo-list]")
    expect(todo_list).to_be_visible()
    expect(todo_list).to_contain_text("Buy groceries")

    percy_snapshot(page, name="test_add_todo_button_after_submit")


def test_add_empty_todo_item(page: Page, base_url: str) -> None:
    page.goto(base_url)
    add_button = page.locator("[data-testid=add-todo-button]")
    add_button.click()
    submit_button = page.locator("[data-testid=submit-todo-button]")
    expect(submit_button).to_be_disabled()
    expect(page.locator("[data-testid=todo-error-message]")).to_have_text("Todo item cannot be empty")


def test_cancel_add_todo(page: Page, base_url: str) -> None:
    page.goto(base_url)
    add_button = page.locator("[data-testid=add-todo-button]")
    add_button.click()
    cancel_button = page.locator("[data-testid=cancel-todo-button]")
    cancel_button.click()
    expect(page.locator("[data-testid=add-todo-input]")).not_to_be_visible()
    expect(add_button).to_be_focused()
