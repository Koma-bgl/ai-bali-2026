import re
import pytest
from playwright.sync_api import Page, expect
from percy import percy_snapshot


def test_add_todo_button_initial_state(page: Page, base_url: str):
    """Test that the add todo button is visible and functional on initial load"""
    page.goto(base_url)
    
    # Take initial snapshot
    percy_snapshot(page, name="test_add_todo_button_initial_state")
    
    # Check that the add button is visible
    add_button = page.get_by_test_id("add-todo-button")
    expect(add_button).to_be_visible()
    expect(add_button).to_have_text("+ Add Todo")
    expect(add_button).to_have_attribute("aria-label", "Add Todo")
    
    # Check button styling and accessibility
    expect(add_button).to_have_class(re.compile(r"add-todo-button.*"))
    expect(add_button).to_be_enabled()
    
    # Check that input is not visible initially
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("submit-todo-button")).not_to_be_visible()
    expect(page.get_by_test_id("cancel-todo-button")).not_to_be_visible()
    
    # Check for empty todo message
    empty_message = page.get_by_test_id("empty-todo-message")
    expect(empty_message).to_be_visible()
    expect(empty_message).to_have_text("No todos yet. Click \"+ Add Todo\" to create your first todo!")


def test_add_todo_button_click_opens_input(page: Page, base_url: str):
    """Test that clicking the add todo button opens the input form"""
    page.goto(base_url)
    
    # Click the add button
    page.get_by_test_id("add-todo-button").click()
    
    # Take snapshot after opening input
    percy_snapshot(page, name="test_add_todo_button_click_opens_input")
    
    # Check that input field is visible and focused
    input_field = page.get_by_test_id("add-todo-input")
    expect(input_field).to_be_visible()
    expect(input_field).to_have_attribute("placeholder", "Enter todo text (minimum 1 character)")
    expect(input_field).to_have_attribute("aria-label", "Todo Input")
    
    # Check that submit and cancel buttons are visible
    submit_button = page.get_by_test_id("submit-todo-button")
    cancel_button = page.get_by_test_id("cancel-todo-button")
    expect(submit_button).to_be_visible()
    expect(cancel_button).to_be_visible()
    expect(submit_button).to_have_text("Submit")
    expect(cancel_button).to_have_text("Cancel")
    
    # Check that submit button is initially disabled (empty input)
    expect(submit_button).to_be_disabled()
    
    # Check that add button is no longer visible
    expect(page.get_by_test_id("add-todo-button")).not_to_be_visible()


def test_add_todo_with_valid_input(page: Page, base_url: str):
    """Test adding a todo with valid input"""
    page.goto(base_url)
    
    # Open input form
    page.get_by_test_id("add-todo-button").click()
    
    # Type a valid todo
    todo_text = "Buy groceries"
    input_field = page.get_by_test_id("add-todo-input")
    input_field.fill(todo_text)
    
    # Take snapshot with input filled
    percy_snapshot(page, name="test_add_todo_with_valid_input_filled")
    
    # Check that submit button is now enabled
    submit_button = page.get_by_test_id("submit-todo-button")
    expect(submit_button).to_be_enabled()
    
    # Submit the todo
    submit_button.click()
    
    # Wait for submission to complete
    page.wait_for_timeout(150)
    
    # Take snapshot after submission
    percy_snapshot(page, name="test_add_todo_with_valid_input_submitted")
    
    # Check that add button is visible again
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    
    # Check that todo was added to the list
    todo_list = page.get_by_test_id("todo-list")
    expect(todo_list).to_be_visible()
    
    # Check that the todo item exists with correct text
    todo_items = page.get_by_test_id("todo-item")
    expect(todo_items).to_have_count(1)
    
    # Check todo text
    todo_text_element = page.locator('[data-testid^="todo-text-"]')
    expect(todo_text_element).to_have_text(todo_text)
    
    # Check that todo is marked as pending
    expect(page.get_by_text("Pending")).to_be_visible()
    expect(page.get_by_text("Completed")).not_to_be_visible()
    
    # Check todo count in header
    expect(page.get_by_text("Your Todo List (1 items)")).to_be_visible()


def test_add_todo_with_empty_input_shows_error(page: Page, base_url: str):
    """Test validation when trying to add empty todo"""
    page.goto(base_url)
    
    # Open input form
    page.get_by_test_id("add-todo-button").click()
    
    # Try to submit with empty input
    page.get_by_test_id("submit-todo-button").click()
    
    # Take snapshot with error
    percy_snapshot(page, name="test_add_todo_with_empty_input_shows_error")
    
    # Check error message
    error_message = page.get_by_test_id("todo-error-message")
    expect(error_message).to_be_visible()
    expect(error_message).to_have_text("Todo item cannot be empty")
    
    # Check that input has aria-invalid attribute
    input_field = page.get_by_test_id("add-todo-input")
    expect(input_field).to_have_attribute("aria-invalid", "true")
    
    # Check that submit button is still disabled
    expect(page.get_by_test_id("submit-todo-button")).to_be_disabled()


def test_add_todo_cancel_functionality(page: Page, base_url: str):
    """Test canceling todo creation"""
    page.goto(base_url)
    
    # Open input form
    page.get_by_test_id("add-todo-button").click()
    
    # Type some text
    page.get_by_test_id("add-todo-input").fill("Test todo")
    
    # Take snapshot before cancel
    percy_snapshot(page, name="test_add_todo_cancel_functionality_before")
    
    # Click cancel
    page.get_by_test_id("cancel-todo-button").click()
    
    # Take snapshot after cancel
    percy_snapshot(page, name="test_add_todo_cancel_functionality_after")
    
    # Check that add button is visible again
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    
    # Check that input form is hidden
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("submit-todo-button")).not_to_be_visible()
    expect(page.get_by_test_id("cancel-todo-button")).not_to_be_visible()
    
    # Check that no todo was added
    expect(page.get_by_test_id("todo-list")).not_to_be_visible()


def test_add_todo_keyboard_navigation(page: Page, base_url: str):
    """Test keyboard accessibility for adding todos"""
    page.goto(base_url)
    
    # Focus the add button using Tab
    page.keyboard.press("Tab")
    
    # Press Enter to open input form
    page.keyboard.press("Enter")
    
    # Check that input is focused
    input_field = page.get_by_test_id("add-todo-input")
    expect(input_field).to_be_focused()
    
    # Type a todo
    todo_text = "Keyboard test todo"
    input_field.fill(todo_text)
    
    # Take snapshot with keyboard input
    percy_snapshot(page, name="test_add_todo_keyboard_navigation_filled")
    
    # Press Enter to submit
    page.keyboard.press("Enter")
    
    # Wait for submission
    page.wait_for_timeout(150)
    
    # Take snapshot after keyboard submission
    percy_snapshot(page, name="test_add_todo_keyboard_navigation_submitted")
    
    # Check that todo was added
    expect(page.get_by_test_id("todo-list")).to_be_visible()
    expect(page.locator('[data-testid^="todo-text-"]')).to_have_text(todo_text)


def test_add_todo_escape_key_cancels(page: Page, base_url: str):
    """Test that Escape key cancels todo creation"""
    page.goto(base_url)
    
    # Open input form
    page.get_by_test_id("add-todo-button").click()
    
    # Type some text
    page.get_by_test_id("add-todo-input").fill("Test todo that will be cancelled")
    
    # Press Escape key
    page.keyboard.press("Escape")
    
    # Check that add button is visible again
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    
    # Check that input form is hidden
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    
    # Check that no todo was added
    expect(page.get_by_test_id("todo-list")).not_to_be_visible()


def test_add_multiple_todos(page: Page, base_url: str):
    """Test adding multiple todos"""
    page.goto(base_url)
    
    todos = ["First todo", "Second todo", "Third todo"]
    
    for i, todo_text in enumerate(todos):
        # Open input form
        page.get_by_test_id("add-todo-button").click()
        
        # Type todo
        page.get_by_test_id("add-todo-input").fill(todo_text)
        
        # Submit
        page.get_by_test_id("submit-todo-button").click()
        
        # Wait for submission
        page.wait_for_timeout(150)
    
    # Take snapshot with multiple todos
    percy_snapshot(page, name="test_add_multiple_todos")
    
    # Check that all todos were added
    todo_items = page.get_by_test_id("todo-item")
    expect(todo_items).to_have_count(3)
    
    # Check todo count in header
    expect(page.get_by_text("Your Todo List (3 items)")).to_be_visible()
    
    # Check that todos are in reverse order (newest first)
    todo_texts = page.locator('[data-testid^="todo-text-"]')
    for i, todo_text in enumerate(todos[::-1]):  # Reverse order
        expect(todo_texts.nth(i)).to_have_text(todo_text)


def test_todo_completion_toggle(page: Page, base_url: str):
    """Test marking todos as complete/incomplete"""
    page.goto(base_url)
    
    # Add a todo
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Test completion")
    page.get_by_test_id("submit-todo-button").click()
    page.wait_for_timeout(150)
    
    # Take snapshot before completion
    percy_snapshot(page, name="test_todo_completion_toggle_before")
    
    # Find and click the checkbox
    checkbox = page.locator('[data-testid^="todo-checkbox-"]')
    expect(checkbox).to_be_visible()
    checkbox.click()
    
    # Take snapshot after completion
    percy_snapshot(page, name="test_todo_completion_toggle_after")
    
    # Check that todo is marked as completed
    expect(page.get_by_text("Completed")).to_be_visible()
    expect(page.get_by_text("Pending")).not_to_be_visible()
    
    # Check that todo text has line-through
    todo_text = page.locator('[data-testid^="todo-text-"]')
    expect(todo_text).to_have_class(re.compile(r".*line-through.*"))
    
    # Check completion stats
    expect(page.get_by_text("Completed: 1 of 1")).to_be_visible()
    expect(page.get_by_text("Pending: 0 of 1")).to_be_visible()


def test_character_count_display(page: Page, base_url: str):
    """Test character count display in input field"""
    page.goto(base_url)
    
    # Open input form
    page.get_by_test_id("add-todo-button").click()
    
    # Check initial character count
    expect(page.get_by_text("0/100 characters")).to_be_visible()
    
    # Type some text
    test_text = "Hello World"
    page.get_by_test_id("add-todo-input").fill(test_text)
    
    # Take snapshot with character count
    percy_snapshot(page, name="test_character_count_display")
    
    # Check updated character count
    expect(page.get_by_text(f"{len(test_text)}/100 characters")).to_be_visible()


def test_add_todo_button_loading_state(page: Page, base_url: str):
    """Test loading state during todo submission"""
    page.goto(base_url)
    
    # Open input form
    page.get_by_test_id("add-todo-button").click()
    
    # Type a todo
    page.get_by_test_id("add-todo-input").fill("Test loading state")
    
    # Submit and check loading state
    page.get_by_test_id("submit-todo-button").click()
    
    # Check that button shows loading text
    expect(page.get_by_test_id("submit-todo-button")).to_have_text("Submitting...")
    expect(page.get_by_test_id("submit-todo-button")).to_be_disabled()
    expect(page.get_by_test_id("cancel-todo-button")).to_be_disabled()
    expect(page.get_by_test_id("add-todo-input")).to_be_disabled()
    
    # Wait for submission to complete
    page.wait_for_timeout(150)
    
    # Check that normal state is restored
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_enabled()