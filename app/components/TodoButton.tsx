'use client';

import { useState } from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoButton() {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [todoText, setTodoText] = useState('');
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const handleAddTodo = () => {
    if (todoText.trim() === '') {
      setError('Todo item cannot be empty');
      return;
    }
    
    // Add new todo item to the beginning of the list
    const newTodo: TodoItem = {
      id: Date.now(),
      text: todoText.trim(),
      completed: false
    };
    
    setTodos(prevTodos => [newTodo, ...prevTodos]);
    setTodoText('');
    setIsInputVisible(false);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
    if (e.key === 'Escape') {
      setIsInputVisible(false);
      setTodoText('');
      setError('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="todo-container max-w-md mx-auto p-4">
      {!isInputVisible ? (
        <button
          onClick={() => setIsInputVisible(true)}
          aria-label="Add Todo"
          className="add-todo-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          data-testid="add-todo-button"
        >
          + Add Todo
        </button>
      ) : (
        <div className="todo-input-container space-y-2 mb-4">
          <input
            type="text"
            value={todoText}
            onChange={(e) => {
              setTodoText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter todo text"
            aria-label="Todo Input"
            className="todo-input border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={handleKeyDown}
            data-testid="add-todo-input"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddTodo}
              aria-label="Submit Todo"
              className="submit-todo-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              data-testid="submit-todo-button"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setIsInputVisible(false);
                setTodoText('');
                setError('');
              }}
              aria-label="Cancel"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              data-testid="cancel-todo-button"
            >
              Cancel
            </button>
          </div>
          {error && (
            <p className="error-message text-red-500 text-sm" data-testid="todo-error-message">
              {error}
            </p>
          )}
        </div>
      )}
      
      {todos.length > 0 && (
        <ul className="todo-list space-y-2 mt-4" data-testid="todo-list">
          {todos.map(todo => (
            <li 
              key={todo.id} 
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
              data-testid="todo-item"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                data-testid={`todo-checkbox-${todo.id}`}
              />
              <span 
                className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                data-testid={`todo-text-${todo.id}`}
              >
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}