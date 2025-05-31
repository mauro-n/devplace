import { useEffect, useRef, useState } from "react";

type props = {
  title?: string
  className?: string
  onItemsChange?: (input: any[]) => void
  isHovering?: (input: boolean) => void
}

function Quadrante({ title = "Drop Zone", className = "", onItemsChange }: any) {
  const [items, setItems] = useState<any>([]);
  const [isHovered, setIsHovered] = useState<any>(false);
  const quadranteRef = useRef<any>(null);

  const handleItemDrop = (item: any) => {
    const newItems = [...items, item];
    setItems(newItems);
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  const removeItem = (index: any) => {
    const newItems = items.filter((_: any, i: any) => i !== index);
    setItems(newItems);
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const dropZone = elementBelow?.closest('[data-drop-zone]');
      const isThisQuadrante = dropZone === quadranteRef.current;
      setIsHovered(isThisQuadrante);
    };

    const handleTodoItemDrop = (e: any) => {
      if (e.detail && e.detail.item) {
        handleItemDrop(e.detail.item);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Set up the drop handler reference for direct access
    if (quadranteRef.current) {
      quadranteRef.current._dropHandler = handleItemDrop;
      quadranteRef.current.addEventListener('todoItemDrop', handleTodoItemDrop);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (quadranteRef.current) {
        quadranteRef.current.removeEventListener('todoItemDrop', handleTodoItemDrop);
      }
    };
  }, []);

  return (
    <div
      ref={quadranteRef}
      data-drop-zone="true"
      className={`
        min-h-48 p-6 border-2 border-dashed rounded-lg transition-all duration-200
        ${isHovered 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 bg-gray-50'
        }
        ${className}
      `}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      
      {items.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Drop todo items here
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item: any, index: any) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm"
            >
              <span>{item}</span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1 rounded hover:bg-red-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-4">
        {items.length} item{items.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default Quadrante