import TodoButton from './components/TodoButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Todo App
          </h1>
          <p className="text-gray-600">
            Organize your tasks and boost your productivity - can't agree more
          </p>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
            <p className="text-gray-600 mb-4">
              Click the button below to add a new todo item to your list. You can mark items as complete when you're done.
            </p>
            <TodoButton />
          </div>
          
          {/* Todo List goes here */}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Click <strong>&quot;+ Add Todo&quot;</strong> to create a new todo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Type your todo text and press <strong>Enter</strong> or click <strong>&quot;Submit&quot;</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Click the checkbox to mark a todo as complete</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Cancel anytime by clicking the <strong>&quot;Cancel&quot;</strong> button</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Use <strong>Escape</strong> key to cancel without clicking the Cancel button</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Navigate with keyboard: <strong>Tab</strong> to button, <strong>Space/Enter</strong> to activate</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
