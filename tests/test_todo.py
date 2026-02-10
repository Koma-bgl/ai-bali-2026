import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot

def test_add_todo_button_visibility(page: Page, base_url: str) -> None:
    page.goto(base_url)
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    percy_snapshot(page, name="add_todo_button_visibility")

def test_add_todo_input_visibility_after_click(page: Page, base_url: str) -> None:
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).to_be_visible()
    percy_snapshot(page, name="add_todo_input_visibility")


def test_add_todo_item(page: Page, base_url: str) -> None:
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Buy milk")
    page.get_by_test_id("add-todo-submit").click()
    expect(page.get_by_test_id("todo-list")).to_contain_text("Buy milk")
    percy_snapshot(page, name="add_todo_item")


def test_add_empty_todo_item(page: Page, base_url: str) -> None:
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    input_field = page.get_by_test_id("add-todo-input")
    input_field.press("Enter")
    expect(page.locator(".text-red-500")).to_have_text("Todo item cannot be empty")
    percy_snapshot(page, name="add_empty_todo_item")


def test_cancel_add_todo(page: Page, base_url: str) -> None:
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Buy milk")
    page.get_by_test_id("add-todo-cancel").click()
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    percy_snapshot(page, name="cancel_add_todo")

def test_press_escape_to_cancel_add_todo(page: Page, base_url: str) -> None:
    page.goto(base_url)
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Buy milk")
    page.get_by_test_id("add-todo-input").press("Escape")
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    percy_snapshot(page, name="escape_add_todo")

