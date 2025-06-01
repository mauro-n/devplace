import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type props = {
  title?: string
  className?: string
  bgColor?: string
  onItemsChange?: (input: any[]) => void
  onItemRemove?: (item: any) => void
  isHovering?: (input: boolean) => void
}

function Quadrante({ title = "Drop Zone", className = "", onItemsChange, onItemRemove, bgColor = "bg-gray-50" }: props) {
  const [items, setItems] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const quadranteRef = useRef<any>(null);

  const handleItemDrop = (item: any) => {
    const newItems = [...items, item];
    setItems(newItems);
    if (onItemsChange) {
      onItemsChange(newItems);
    }
  };

  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items);
    }
  }, [items]);

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    if (onItemsChange) {
      onItemsChange(newItems);
    }
    if (onItemRemove) {
      onItemRemove(items[index]);
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
  }, [items]);

  return (
    <div
      ref={quadranteRef}
      data-drop-zone="true"
      className={`
        h-full p-4 border-2 border-dashed rounded-lg transition-all duration-200 max-h-[195px] flex flex-col
        ${bgColor} 
        ${className}
        ${isHovered ? '!border-blue-300' : ''}
      `}
      style={{ zIndex: isHovered ? 1 : 0 }}
    >
      <h3 className="text-sm font-semibold mb-3 text-gray-700 text-center flex-shrink-0">{title}</h3>

      {items.length === 0 ? (
        <div className="text-gray-400 text-center py-4 text-xs flex-grow flex items-center justify-center">
          Drop items here
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto pr-1 flex-grow">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 shadow-sm text-xs group hover:bg-gray-50 transition-colors duration-150"
            >
              <span className="flex-1 truncate text-gray-900">{item}</span>
              <button
                onClick={() => removeItem(index)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-3 text-center flex-shrink-0">
        {items.length} item{items.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default Quadrante