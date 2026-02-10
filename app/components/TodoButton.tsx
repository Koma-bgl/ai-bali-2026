import { useState } from 'react';

export default function TodoButton() {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [todoText, setTodoText] = useState('');
  const [error, setError] = useState('');

  const handleAddTodo = () => {
    if (todoText.trim() === '') {
      setError('Todo text cannot be empty');
      return;
    }
    // TODO: Add logic to submit the todo item
    console.log('Adding todo:', todoText);
    setTodoText('');
    setIsInputVisible(false);
    setError('');
  };

  return (
    <div className="todo-button-container">
      {!isInputVisible ? (
        <button
          onClick={() => setIsInputVisible(true)}
          aria-label="Add Todo"
          className="add-todo-button"
        >
          + Add Todo
        </button>
      ) : (
        <div className="todo-input-container">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Enter todo text"
            aria-label="Todo Input"
            className="todo-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button
            onClick={handleAddTodo}
            aria-label="Submit Todo"
            className="submit-todo-button"
          >
            Add
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}
