// app/components/TodoButton.tsx
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

  return (
    <div>
      {!isInputVisible ? (
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          aria-label="Add Todo"
          data-testid="add-todo-button"
        >
          + Add Todo
        </button>
      ) : (
        <div className="flex flex-col">
          <div className="mb-2">
            <input
              ref={inputRef}
              type="text"
              id="add-todo-input"
              placeholder="Enter todo item"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={todoText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              data-testid="add-todo-input"
            />
            {error && <p className="text-red-500 text-xs italic" data-testid="todo-error-message">{error}</p>}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddTodo}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              disabled={isSubmitting || todoText.trim().length === 0}
              data-testid="submit-todo-button"
            >
              Submit
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              data-testid="cancel-todo-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
