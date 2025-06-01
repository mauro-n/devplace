import { useState } from "react";
import Quadrante from "../Quadrante";
import TodoItem from "../TodoItem";

function MatrixEisen() {
  const [dragInfo, setDragInfo] = useState<{ x: number, y: number } | null>(null);
  const [todoItems, setTodoItems] = useState(someMockItems);
  const [newTodo, setNewTodo] = useState("");

  const handleItemDropOnQuadrante = (index: number) => {
    setTodoItems(prev => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleOnItemsChange = (items: any[]) => {
    // console.log("Items changed:", items);
  }
  
  const handleOnItemRemoved = (item: any) => {
    setTodoItems(prev => {
      const items = [...prev];
      items.push(item)
      return items
    });    
  }

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodoItems(prev => [...prev, newTodo.trim()]);
      setNewTodo("");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Eisenhower Matrix</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1" style={{ zIndex: 1000, position: 'relative' }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Todo Items</h2>
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddTodo(); }}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 transition-colors"
              disabled={!newTodo.trim()}
              onClick={handleAddTodo}
            >
              Add
            </button>
          </div>

          <div className="space-y-2 space-x-2">
            {todoItems.map((item, i) => (
              <TodoItem
                key={`${item}-${i}`}
                onDrag={setDragInfo}
                onDrop={() => handleItemDropOnQuadrante(i)}
              >
                {item}
              </TodoItem>
            ))}
          </div>
        </div>

        {/* 2x2 Matrix Section */}
        <div className="xl:col-span-2" style={{ zIndex: 1, position: 'relative' }}>
          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-600">
              IMPORTANT
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-600">
              NOT IMPORTANT
            </div>
            <div className="absolute top-1/2 -left-14 transform -translate-y-1/2 -rotate-90 text-sm font-semibold text-gray-600">
              NOT URGENT
            </div>
            <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 -rotate-90 text-sm font-semibold text-gray-600">
              URGENT
            </div>

            <div className={`relative grid grid-cols-2 grid-rows-2 gap-0 h-96 border-4 border-gray-800 rounded-lg overflow-hidden ${dragInfo ? 'z-0' : ''}`}>
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2 z-10"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2 z-10"></div>

              <div className="relative">
                <Quadrante
                  title="📅 DECIDE"
                  bgColor="bg-yellow-50"
                  className="border-0 rounded-none h-full"
                />
              </div>

              <div className="relative">
                <Quadrante
                  onItemsChange={handleOnItemsChange}
                  onItemRemove={handleOnItemRemoved}
                  title="🔥 DO"
                  bgColor="bg-red-50"
                  className="border-0 rounded-none h-full"
                />
              </div>

              <div className="relative">
                <Quadrante
                  title="🗑️ DELETE"
                  bgColor="bg-gray-100"
                  className="border-0 rounded-none h-full"
                />
              </div>

              <div className="relative">
                <Quadrante
                  title="👥 DELEGATE"
                  bgColor="bg-blue-50"
                  className="border-0 rounded-none h-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                <span><strong>DECIDE:</strong> Important & Not Urgent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span><strong>DELETE:</strong> Not Important & Not Urgent</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span><strong>DO:</strong> Important & Urgent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                <span><strong>DELEGATE:</strong> Not Important & Urgent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dragInfo && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 rounded text-sm z-50">
          Position: {Math.round(dragInfo.x)}, {Math.round(dragInfo.y)}
        </div>
      )}

      <div className="mt-8 max-w-4xl mx-auto text-gray-600">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-3 text-lg">How to use the Eisenhower Matrix:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2">💡 <strong>Drag and drop</strong> your todo items into the appropriate quadrants based on urgency and importance.</p>
              <p>🔥 <strong>DO (Red):</strong> Urgent and important tasks that need immediate attention</p>
            </div>
            <div>
              <p className="mb-2">📅 <strong>DECIDE (Yellow):</strong> Important but not urgent - schedule these</p>
              <p className="mb-2">👥 <strong>DELEGATE (Blue):</strong> Urgent but not important - assign to others</p>
              <p>🗑️ <strong>DELETE (Gray):</strong> Neither urgent nor important - eliminate these</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatrixEisen;

const someMockItems = [
  '📝 Buy groceries',
  '🏃‍♂️ Go for a run',
  '📚 Read a book',
  '⭐ Important task',
]