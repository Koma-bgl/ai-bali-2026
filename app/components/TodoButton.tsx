'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  const handleAddTodo = async () => {
    if (todoText.trim() === '') {
      setError('Todo item cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate async operation (like API call) with a small delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
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
    setIsSubmitting(false);
    
    // Return focus to the add button
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
    if (e.key === 'Escape') {
      setIsInputVisible(false);
      setTodoText('');
      setError('');
      
      // Return focus to the add button
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }, 50);
    }
  };

  const handleButtonClick = () => {
    setIsInputVisible(true);
  };

  const handleCancel = () => {
    setIsInputVisible(false);
    setTodoText('');
    setError('');
    
    // Return focus to the add button
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }, 50);
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTodoText(value);
    
    // Clear error when user starts typing
    if (error && value.trim().length > 0) {
      setError('');
    }
  };

  return (
    <div className="todo-container max-w-md mx-auto p-4">
      {!isInputVisible ? (
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          aria-label="Add Todo"
          className="add-todo-button bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="add-todo-button"
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            '+ Add Todo'
          )}
        </button>
      ) : (
        <div className="todo-input-container space-y-3" role="form" aria-label="Add new todo form">
          <input
            ref={inputRef}
            type="text"
            value={todoText}
            onChange={handleInputChange}
            placeholder="Enter todo text (minimum 1 character)"
            aria-label="Todo Input"
            aria-describedby={error ? "todo-error" : undefined}
            aria-invalid={!!error}
            className="todo-input border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            onKeyDown={handleKeyDown}
            data-testid="add-todo-input"
            maxLength={100}
            disabled={isSubmitting}
          />
          
          {error && (
            <p 
              id="todo-error"
              className="error-message text-red-500 text-sm font-medium" 
              data-testid="todo-error-message"
              role="alert"
            >
              {error}
            </p>
          )}
          
          <div className="character-count text-right text-xs text-gray-500">
            {todoText.length}/100 characters
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleAddTodo}
              aria-label="Submit Todo"
              className="submit-todo-button bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-todo-button"
              disabled={isSubmitting || todoText.trim().length === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              onClick={handleCancel}
              aria-label="Cancel adding todo"
              className="cancel-todo-button bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="cancel-todo-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {todos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Todo List ({todos.length} items)</h3>
          <ul 
            className="todo-list space-y-3" 
            data-testid="todo-list"
            aria-label="Todo list"
          >
            {todos.map(todo => (
              <li 
                key={todo.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 ${todo.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                data-testid="todo-item"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                  className="h-5 w-5 mt-1 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-2"
                  data-testid={`todo-checkbox-${todo.id}`}
                  id={`todo-checkbox-${todo.id}`}
                />
                <label 
                  htmlFor={`todo-checkbox-${todo.id}`}
                  className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  data-testid={`todo-text-${todo.id}`}
                >
                  {todo.text}
                  <span className="sr-only">
                    {todo.completed ? ' (completed)' : ' (pending)'}
                  </span>
                </label>
                <span className={`text-xs px-2 py-1 rounded ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Completed: {todos.filter(todo => todo.completed).length} of {todos.length}
              </span>
              <span>
                Pending: {todos.filter(todo => !todo.completed).length} of {todos.length}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {todos.length === 0 && !isInputVisible && (
        <div className="mt-6 text-center text-gray-500" data-testid="empty-todo-message">
          <p>No todos yet. Click "+ Add Todo" to create your first todo!</p>
        </div>
      )}
    </div>
  );
}