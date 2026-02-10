"use client";

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
        if (todoText.trim() !== '') {
            handleAddTodo();
        } else {
            setError('Todo item cannot be empty');
        }
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

    useEffect(() => {
        if (isInputVisible) {
            if (todoText.trim() === '') {
                setError('Todo item cannot be empty');
            } else {
                setError('');
            }
        }
    }, [todoText, isInputVisible]);

  return (
    <div className="todo-container max-w-md mx-auto p-4">
      {!isInputVisible ? (
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          aria-label="Add Todo"
          data-testid="add-todo-button"
          className="add-todo-button bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          + Add Todo
        </button>
      ) : (
        <div className="add-todo-form">
          <input
            type="text"
            ref={inputRef}
            data-testid="add-todo-input"
            value={todoText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter todo item"
            aria-label="Todo item text"
            className="w-full p-3 mb-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              data-testid="submit-todo-button"
              onClick={handleAddTodo}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              disabled={isSubmitting || todoText.trim() === ''}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
            <button
              data-testid="cancel-todo-button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {todos.length > 0 && (
        <ul data-testid="todo-list" className="todo-list mt-4 space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              data-testid="todo-item"
              className="flex items-center justify-between p-3 bg-gray-50 rounded shadow-sm"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                  {todo.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
