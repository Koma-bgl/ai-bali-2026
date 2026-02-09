import pytest
from playwright.sync_api import Page, expect

def test_homepage_has_todo_app(page: Page):
    page.goto('http://127.0.0.1:9003')
    expect(page.locator('h1')).to_have_text('Todo App')

def test_homepage_title_contains_todo_app(page: Page):
    page.goto('http://127.0.0.1:9003')
    expect(page).to_have_title('Todo App')