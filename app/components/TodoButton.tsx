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
          className="add-todo-button bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 data-testid=\"add-todo-button\""
        >
          + Add Todo
        </button>
      ) : (
        <div className="input-form flex flex-col">
          <div className="relative">
            <input
              type="text"
              ref={inputRef}
              className="todo-input shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 data-testid=\"add-todo-input\""
              placeholder="Enter todo item"
              value={todoText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              aria-label="Todo item text"
            />
            {error && <p className="text-red-500 text-xs italic absolute -bottom-5">{error}</p>}
          </div>
          <div className="button-group flex justify-end">
            <button
              className="submit-button bg-green-500 hover:bg-green-700 active:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 transition-colors duration-200"
              onClick={handleAddTodo}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Submit'}
            </button>
            <button
              className="cancel-button bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {todos.length > 0 && (
        <ul className="todo-list mt-4 data-testid=\"todo-list\"">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item flex items-center justify-between py-2 px-4 border-b border-gray-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 leading-tight"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
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