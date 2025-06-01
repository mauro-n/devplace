import { useEffect, useRef, useState } from "react";

function TodoItem({ children = "Todo item", onDrag, onDrop, className = "", id }: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y - window.scrollY
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y - window.scrollY;
    setPosition({ x: newX, y: newY });
    if (onDrag) {
      onDrag({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (e: any) => {
    if (!isDragging) return;

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    const dropZone = elementBelow?.closest('[data-drop-zone]');
    if (dropZone) {
      const dropHandler = (dropZone as any)._dropHandler;
      if (dropHandler) {
        dropHandler(children);
      } else {
        const dropEvent = new CustomEvent('todoItemDrop', {
          detail: { item: children },
          bubbles: true
        });
        dropZone.dispatchEvent(dropEvent);
      }
      onDrop();
    }

    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: any) => handleMouseMove(e);
      const handleMouseUpGlobal = (e: any) => handleMouseUp(e);
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
      };
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  return (
    <div
      ref={dragRef}
      className={`
        inline-block p-3 bg-white border border-gray-200 rounded-lg shadow-sm
        select-none
        ${isDragging
          ? 'cursor-grabbing shadow-lg scale-105 z-100'
          : 'cursor-grab hover:shadow-md'
        }
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: isDragging ? 'none' : 'auto',
        zIndex: isDragging ? 9999 : 'auto',
        //position: isDragging ? 'absolute' : 'relative',
      }}
      onMouseDown={handleMouseDown}
      data-todo-id={id}
    >
      {children}
    </div>
  );
}

export default TodoItem