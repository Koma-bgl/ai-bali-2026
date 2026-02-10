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
    page.get_by_test_id("submit-todo-button").click()
    expect(input_field).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    # Todo list verification would go here, but there's no todo list yet.
    percy_snapshot(page, name="add_todo_item_submitted")

def test_add_todo_item_empty_validation(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    submit_button = page.get_by_test_id("submit-todo-button")
    expect(submit_button).to_be_disabled()

    input_field = page.get_by_test_id("add-todo-input")
    input_field.press("Enter")
    expect(page.get_by_test_id("todo-error-message")).to_have_text("Todo item cannot be empty")
    percy_snapshot(page, name="add_todo_item_empty_validation")

def test_add_todo_cancel_button(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Some todo")
    page.get_by_test_id("cancel-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
