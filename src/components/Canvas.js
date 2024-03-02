import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [rectangles, setRectangles] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!dragging) {
      setStartPosition({ x, y });
      setDrawing(true);
    } else {
      const selectedRect = rectangles.find(rect => {
        return (
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
        );
      });

      if (selectedRect) {
        setSelectedRectangle(selectedRect);
        setDragStartPosition({ x, y });
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!drawing && !dragging) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (drawing) {
      const width = x - startPosition.x;
      const height = y - startPosition.y;
      drawRect(startPosition.x, startPosition.y, width, height);
    } else if (dragging && selectedRectangle) {
      const deltaX = x - dragStartPosition.x;
      const deltaY = y - dragStartPosition.y;
      moveRectangle(selectedRectangle, deltaX, deltaY);
      setDragStartPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      const newRectangles = [...rectangles];
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = startPosition.x - rect.left;
      const y = startPosition.y - rect.top;
      const width = dragStartPosition.x - rect.left - startPosition.x;
      const height = dragStartPosition.y - rect.top - startPosition.y;
      newRectangles.push({ x, y, width, height });
      setRectangles(newRectangles);
    } else if (dragging) {
      setDragging(false);
      setSelectedRectangle(null);
    }
  };

  const drawRect = (x, y, width, height) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    clearCanvas();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, width, height);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(rect => {
      ctx.strokeStyle = 'black';
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });
  };

  const moveRectangle = (rectangle, deltaX, deltaY) => {
    rectangle.x += deltaX;
    rectangle.y += deltaY;
    clearCanvas();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 bg-gray-100"
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.9}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <button onClick={() => setDrawing(true)}>Create Rectangle</button>
      <button onClick={() => setDragging(true)}>Drag & Drop</button>
    </div>
  );
};

export default Canvas;
