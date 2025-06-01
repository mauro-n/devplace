import { useState } from "react";
import Quadrante from "../Quadrante";
import TodoItem from "../TodoItem";
import { Plus } from "lucide-react";
import TasksPanel from "../TasksPanel";

function MatrixEisen() {
  const [dragInfo, setDragInfo] = useState<any>(null);
  const [todoItems, setTodoItems] = useState(someMockItems);
  const [newTodo, setNewTodo] = useState("");

  const handleItemDropOnQuadrante = (index: number) => {
    setTodoItems(prev => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleOnItemsChange = (items: any) => {
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

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
 
        <TasksPanel />
        {/* <div className="xl:col-span-1" style={{ zIndex: 1000, position: 'relative' }}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h2 className="font-medium text-gray-900">Todo Items</h2>
              </div>
              <span className="text-xs text-gray-500">{todoItems.length} total</span>
            </div>            
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new task..."
                  className="flex-1 bg-transparent text-sm placeholder-gray-400 text-gray-900 focus:outline-none border-b border-gray-200 pb-2 focus:border-blue-500 transition-colors duration-200"
                />
                {newTodo.trim() && (
                  <button
                    onClick={handleAddTodo}
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>            
            <div className="space-y-3">
              {todoItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Plus size={24} className="mx-auto" />
                  </div>
                  <p className="text-sm text-gray-500">No tasks yet. Add one above!</p>
                </div>
              ) : (
                todoItems.map((item, i) => (
                  <TodoItem
                    key={`${item}-${i}`}
                    onDrag={setDragInfo}
                    onDrop={() => handleItemDropOnQuadrante(i)}
                  >
                    {item}
                  </TodoItem>
                ))
              )}
            </div>
          </div>
        </div> */}
        
        <div className="xl:col-span-2" style={{ zIndex: 1, position: 'relative' }}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h2 className="font-medium text-gray-900">Priority Matrix</h2>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                IMPORTANT
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                NOT IMPORTANT
              </div>
              <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-600">
                NOT URGENT
              </div>
              <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-600">
                URGENT
              </div>

              <div className={`relative grid grid-cols-2 grid-rows-2 gap-2 h-96 ${dragInfo ? 'z-0' : ''}`}>
                <div className="relative">
                  <Quadrante
                    title="📅 DECIDE"
                    bgColor="bg-yellow-50"
                    className="border-2 border-yellow-200 rounded-lg h-full"
                    onItemsChange={handleOnItemsChange}
                    onItemRemove={handleOnItemRemoved}
                  />
                </div>

                <div className="relative">
                  <Quadrante
                    onItemsChange={handleOnItemsChange}
                    onItemRemove={handleOnItemRemoved}
                    title="🔥 DO"
                    bgColor="bg-red-50"
                    className="border-2 border-red-200 rounded-lg h-full"
                  />
                </div>

                <div className="relative">
                  <Quadrante
                    title="🗑️ DELETE"
                    bgColor="bg-gray-100"
                    className="border-2 border-gray-300 rounded-lg h-full"
                    onItemsChange={handleOnItemsChange}
                    onItemRemove={handleOnItemRemoved}
                  />
                </div>

                <div className="relative">
                  <Quadrante
                    title="👥 DELEGATE"
                    bgColor="bg-blue-50"
                    className="border-2 border-blue-200 rounded-lg h-full"
                    onItemsChange={handleOnItemsChange}
                    onItemRemove={handleOnItemRemoved}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></div>
                  <span><strong>DECIDE:</strong> Important & Not Urgent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                  <span><strong>DELETE:</strong> Not Important & Not Urgent</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                  <span><strong>DO:</strong> Important & Urgent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                  <span><strong>DELEGATE:</strong> Not Important & Urgent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <h3 className="font-medium text-gray-900">How to use</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
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

      {dragInfo && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg">
          Position: {Math.round(dragInfo.x)}, {Math.round(dragInfo.y)}
        </div>
      )}
    </div>
  );
}

const someMockItems = [
  '📝 Buy groceries',
  '🏃‍♂️ Go for a run',
  '📚 Read a book',
  '⭐ Important task',
];

export default MatrixEisen;