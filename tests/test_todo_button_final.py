import pytest
import re
from playwright.sync_api import Page, expect


def test_add_todo_button_visible(page: Page, base_url: str):
    """Test that the add todo button is visible on the main page"""
    page.goto(base_url)
    
    # Check the button is visible with the correct text
    add_button = page.get_by_test_id("add-todo-button")
    expect(add_button).to_be_visible()
    expect(add_button).to_have_text("+ Add Todo")
    
    # Check the button has proper aria-label
    expect(add_button).to_have_attribute("aria-label", "Add Todo")
    
    # Take Percy snapshot of initial state
    # percy_snapshot(page, name="todo_button_initial_state")


def test_click_button_opens_input_field(page: Page, base_url: str):
    """Test that clicking the button opens an input field"""
    page.goto(base_url)
    
    # Click the add todo button
    add_button = page.get_by_test_id("add-todo-button")
    add_button.click()
    
    # Check that input field is visible
    todo_input = page.get_by_test_id("add-todo-input")
    expect(todo_input).to_be_visible()
    expect(todo_input).to_have_attribute("placeholder", re.compile("Enter todo text.*"))
    expect(todo_input).to_have_attribute("aria-label", "Todo Input")
    
    # Check that submit and cancel buttons are visible
    submit_button = page.get_by_test_id("submit-todo-button")
    expect(submit_button).to_be_visible()
    expect(submit_button).to_have_text("Submit")
    
    cancel_button = page.get_by_test_id("cancel-todo-button")
    expect(cancel_button).to_be_visible()
    expect(cancel_button).to_have_text("Cancel")
    
    # Check that input has autoFocus
    expect(todo_input).to_be_focused()
    
    # Take Percy snapshot of input field open
    # percy_snapshot(page, name="todo_input_field_open")


def test_add_todo_item(page: Page, base_url: str):
    """Test adding a new todo item to the list"""
    page.goto(base_url)
    
    # Click to open input field
    page.get_by_test_id("add-todo-button").click()
    
    # Enter todo text and submit
    todo_input = page.get_by_test_id("add-todo-input")
    todo_input.fill("Buy groceries")
    page.get_by_test_id("submit-todo-button").click()
    
    # Check that todo item was added to the list
    todo_list = page.get_by_test_id("todo-list")
    expect(todo_list).to_be_visible()
    
    todo_items = page.get_by_test_id("todo-item")
    expect(todo_items).to_have_count(1)
    
    # Check the todo text is correct
    todo_text = page.get_by_test_id(re.compile(r"todo-text-\d+"))
    expect(todo_text).to_have_text("Buy groceries")
    
    # Check that checkbox is present and not checked
    todo_checkbox = page.get_by_test_id(re.compile(r"todo-checkbox-\d+"))
    expect(todo_checkbox).not_to_be_checked()
    
    # Check that input field is hidden again
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    
    # Check that add button is visible again
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    
    # Take Percy snapshot after adding todo
    # percy_snapshot(page, name="after_adding_first_todo")


def test_add_multiple_todo_items(page: Page, base_url: str):
    """Test adding multiple todo items"""
    page.goto(base_url)
    
    # Add first todo
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("First task")
    page.get_by_test_id("submit-todo-button").click()
    
    # Add second todo
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Second task")
    page.get_by_test_id("submit-todo-button").click()
    
    # Check both items are in the list
    todo_items = page.get_by_test_id("todo-item")
    expect(todo_items).to_have_count(2)
    
    # Check that new items appear at the top (based on implementation)
    todo_texts = page.locator("[data-testid^='todo-text-']")
    expect(todo_texts.first).to_have_text("Second task")
    expect(todo_texts.last).to_have_text("First task")
    
    # Take Percy snapshot with multiple todos
    # percy_snapshot(page, name="multiple_todos_added")


def test_empty_todo_validation(page: Page, base_url: str):
    """Test validation prevents empty todos"""
    page.goto(base_url)
    
    # Click to open input field
    page.get_by_test_id("add-todo-button").click()
    
    # Try to submit empty todo
    page.get_by_test_id("submit-todo-button").click()
    
    # Check error message is shown
    error_message = page.get_by_test_id("todo-error-message")
    expect(error_message).to_be_visible()
    expect(error_message).to_have_text("Todo item cannot be empty")
    
    # Check input field is still visible (not cleared)
    expect(page.get_by_test_id("add-todo-input")).to_be_visible()
    expect(page.get_by_test_id("submit-todo-button")).to_be_visible()
    expect(page.get_by_test_id("cancel-todo-button")).to_be_visible()
    
    # Enter valid text and check error disappears
    page.get_by_test_id("add-todo-input").fill("V")
    expect(error_message).not_to_be_visible()
    
    # Submit valid task
    page.get_by_test_id("submit-todo-button").click()
    
    # Check task was added
    todo_items = page.get_by_test_id("todo-item")
    expect(todo_items).to_have_count(1)
    
    # Take Percy snapshot of validation error
    # percy_snapshot(page, name="validation_error_displayed")


def test_cancel_add_todo(page: Page, base_url: str):
    """Test canceling todo addition"""
    page.goto(base_url)
    
    # Click to open input field
    page.get_by_test_id("add-todo-button").click()
    
    # Enter some text
    page.get_by_test_id("add-todo-input").fill("Task to cancel")
    
    # Click cancel
    page.get_by_test_id("cancel-todo-button").click()
    
    # Check input is hidden and button is visible
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("submit-todo-button")).not_to_be_visible()
    expect(page.get_by_test_id("cancel-todo-button")).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    
    # Re-open and check text was cleared
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).to_have_value("")
    
    # Take Percy snapshot after cancellation
    # percy_snapshot(page, name="after_canceling_todo")


def test_keyboard_submission(page: Page, base_url: str):
    """Test submitting todo using Enter key"""
    page.goto(base_url)
    
    # Click to open input field
    page.get_by_test_id("add-todo-button").click()
    
    # Enter text and press Enter
    todo_input = page.get_by_test_id("add-todo-input")
    todo_input.fill("Task submitted with Enter")
    todo_input.press("Enter")
    
    # Check todo was added
    todo_items = page.get_by_test_id("todo-item")
    expect(todo_items).to_have_count(1)
    
    todo_text = page.get_by_test_id(re.compile(r"todo-text-\d+"))
    expect(todo_text).to_have_text("Task submitted with Enter")


def test_escape_key_cancels(page: Page, base_url: str):
    """Test pressing Escape key cancels todo addition"""
    page.goto(base_url)
    
    # Click to open input field
    page.get_by_test_id("add-todo-button").click()
    
    # Enter some text
    todo_input = page.get_by_test_id("add-todo-input")
    todo_input.fill("Task to cancel with Escape")
    
    # Press Escape
    todo_input.press("Escape")
    
    # Check input is hidden and button is visible
    expect(page.get_by_test_id("add-todo-input")).not_to_be_visible()
    expect(page.get_by_test_id("submit-todo-button")).not_to_be_visible()
    expect(page.get_by_test_id("cancel-todo-button")).not_to_be_visible()
    expect(page.get_by_test_id("add-todo-button")).to_be_visible()
    
    # Re-open and check text was cleared
    page.get_by_test_id("add-todo-button").click()
    expect(page.get_by_test_id("add-todo-input")).to_have_value("")


def test_todo_completion_toggle(page: Page, base_url: str):
    """Test marking todo as complete/incomplete"""
    page.goto(base_url)
    
    # Add a todo
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Task to complete")
    page.get_by_test_id("submit-todo-button").click()
    
    # Get the checkbox and todo text
    todo_checkbox = page.get_by_test_id(re.compile(r"todo-checkbox-\d+"))
    todo_text = page.get_by_test_id(re.compile(r"todo-text-\d+"))
    
    # Initially not completed
    expect(todo_checkbox).not_to_be_checked()
    
    # Click checkbox to mark as complete
    todo_checkbox.click()
    
    # Check it's now completed
    expect(todo_checkbox).to_be_checked()
    
    # Click again to mark as incomplete
    todo_checkbox.click()
    
    # Check it's back to incomplete
    expect(todo_checkbox).not_to_be_checked()


def test_button_accessibility_and_focus(page: Page, base_url: str):
    """Test button accessibility and focus management"""
    page.goto(base_url)
    
    # Test keyboard navigation to button (first focusable element)
    page.keyboard.press("Tab")
    
    # Button should be focused
    add_button = page.get_by_test_id("add-todo-button")
    expect(add_button).to_be_focused()
    
    # Press Space to activate button
    page.keyboard.press(" ")
    
    # Input should be visible and focused
    todo_input = page.get_by_test_id("add-todo-input")
    expect(todo_input).to_be_visible()
    expect(todo_input).to_be_focused()
    
    # Cancel and test Enter also works on button
    page.get_by_test_id("cancel-todo-button").click()
    expect(add_button).to_be_visible()
    
    # Tab to button again and test Enter
    page.keyboard.press("Tab")
    page.keyboard.press("Enter")
    
    # Input should be visible again
    expect(todo_input).to_be_visible()
    expect(todo_input).to_be_focused()


def test_max_character_limit(page: Page, base_url: str):
    """Test that maximum character limit is enforced"""
    page.goto(base_url)
    
    # Click to open input field
    page.get_by_test_id("add-todo-button").click()
    
    # Enter text up to the character limit
    todo_input = page.get_by_test_id("add-todo-input")
    
    # Try to enter more than 100 characters
    long_text = "A" * 105
    todo_input.fill(long_text)
    
    # Check that input is limited to 100 characters
    expect(todo_input).to_have_value("A" * 100)
    
    # Check character count display
    character_count = page.locator(".character-count")
    expect(character_count).to_be_visible()
    expect(character_count).to_contain_text("100/100")


def test_button_states_and_loading(page: Page, base_url: str):
    """Test button states (hover, active, loading)"""
    page.goto(base_url)
    
    # Test button hover state (visual check, cannot assert easily)
    add_button = page.get_by_test_id("add-todo-button")
    
    # Click button to open input
    add_button.click()
    
    # Test disabled state on submit button with empty input
    submit_button = page.get_by_test_id("submit-todo-button")
    expect(submit_button).to_be_disabled()
    
    # Enter text and check button becomes enabled
    page.get_by_test_id("add-todo-input").fill("Test task")
    expect(submit_button).not_to_be_disabled()
    
    # Cancel to test loading state simulation
    page.get_by_test_id("cancel-todo-button").click()
    
    # Click add button and submit quickly to see loading state
    # (Note: Loading state is simulated with async operation)


def test_empty_todo_message(page: Page, base_url: str):
    """Test empty todo list message"""
    page.goto(base_url)
    
    # Check empty todo message is shown
    empty_message = page.get_by_test_id("empty-todo-message")
    expect(empty_message).to_be_visible()
    expect(empty_message).to_contain_text("No todos yet")
    
    # Add a todo and check message disappears
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("First todo")
    page.get_by_test_id("submit-todo-button").click()
    
    # Empty message should not be visible
    expect(empty_message).not_to_be_visible()


def test_todo_list_summary(page: Page, base_url: str):
    """Test todo list summary statistics"""
    page.goto(base_url)
    
    # Add a todo
    page.get_by_test_id("add-todo-button").click()
    page.get_by_test_id("add-todo-input").fill("Task one")
    page.get_by_test_id("submit-todo-button").click()
    
    # Check summary shows 1 pending task
    expect(page.locator("text=Completed: 0 of 1")).to_be_visible()
    expect(page.locator("text=Pending: 1 of 1")).to_be_visible()
    
    # Mark as complete
    todo_checkbox = page.get_by_test_id(re.compile(r"todo-checkbox-\d+"))
    todo_checkbox.click()
    
    # Check summary updates
    expect(page.locator("text=Completed: 1 of 1")).to_be_visible()
    expect(page.locator("text=Pending: 0 of 1")).to_be_visible()