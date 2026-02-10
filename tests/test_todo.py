import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot


def test_add_todo_button_visibility(page: Page, base_url: str):
    page.goto(base_url)
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    percy_snapshot(page, name="test_add_todo_button_visibility")


def test_add_todo_button_click_reveals_input(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).to_be_visible()
    percy_snapshot(page, name="test_add_todo_button_click_reveals_input")


def test_can_add_a_todo_item(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Buy groceries")
    page.get_by_test_id("submit-todo-button").click()
    expect(page.get_by_test_id("todo-list")).to_be_visible()
    expect(page.get_by_test_id("todo-list")).to_contain_text("Buy groceries")
    expect(page.get_by_test_id("add-todo-input")).to_have_value("")
    percy_snapshot(page, name="test_can_add_a_todo_item")

def test_add_todo_item_empty_validation(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("")
    expect(page.get_by_test_id("submit-todo-button")).to_be_disabled()


def test_add_todo_item_empty_enter_validation(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    input_field = page.get_by_test_id("add-todo-input")
    input_field.fill("")
    input_field.press("Enter")
    expect(page.locator(".text-red-500")).to_have_text("Todo item cannot be empty")


def test_press_escape_to_cancel(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).to_be_visible()
    page.get_by_test_id("add-todo-input").press("Escape")
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_focused()
    percy_snapshot(page, name="test_press_escape_to_cancel")

def test_submit_todo_button_disabled_at_first(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("submit-todo-button")).to_be_disabled()
    percy_snapshot(page, name="test_submit_todo_button_disabled_at_first")


def test_focus_returns_to_add_button_after_cancel(page: Page, base_url: str):
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("cancel-todo-button").click()
    expect(page.get_by_test_id("add-todo-button")).to_be_focused()
    percy_snapshot(page, name="test_focus_returns_to_add_button_after_cancel")