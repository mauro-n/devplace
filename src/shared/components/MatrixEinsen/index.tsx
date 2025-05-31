import { useState } from "react";
import Quadrante from "../Quadrante";
import TodoItem from "../TodoItem";

function MatrixEisen() {
  const [dragInfo, setDragInfo] = useState<any>(null);
  const [quadranteItems, setQuadranteItems] = useState<any>([]);
  const [todoItems, setTodoItems] = useState<any[]>(someMockItems)

  const handleItemDrop = (index: number) => {
    setTodoItems(prev => {
      return prev.filter((_, i) => i !== index)
    })
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Draggable Todo Items with Drop Zone</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Todo Items</h2>
          {todoItems.map((el, i) => {
            return (
              <TodoItem
                key={i}
                onDrag={setDragInfo}
                onDrop={() => handleItemDrop(i)}
              >
                {el}
              </TodoItem>
            )
          })}
        </div>

        {/* Drop Zones */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Drop Zones</h2>

          <Quadrante
            title="📋 To Do"
            onItemsChange={setQuadranteItems}
          />

          <Quadrante
            title="🔄 In Progress"
            className="border-yellow-300 bg-yellow-50"
          />

          <Quadrante
            title="✅ Done"
            className="border-green-300 bg-green-50"
          />
        </div>
      </div>

      {dragInfo && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 rounded text-sm">
          Position: {Math.round(dragInfo.x)}, {Math.round(dragInfo.y)}
        </div>
      )}

      <div className="mt-8 text-gray-600 max-w-2xl">
        <p>💡 Click and drag any todo item into the drop zones!</p>
        <p className="text-sm mt-2">The drop zones will highlight when you hover over them while dragging.</p>
        <div className="mt-4 p-4 bg-white rounded border">
          <h3 className="font-semibold mb-2">Test scrolling:</h3>
          <div className="h-96 bg-gray-100 p-4 rounded">
            <p>Scroll down and try dragging items - positions should stay correct!</p>
            <div className="h-64 bg-gradient-to-b from-blue-50 to-purple-50 mt-4 rounded flex items-center justify-center">
              <span className="text-gray-600">Scroll area for testing</span>
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