import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [rectangles, setRectangles] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setStartPosition({ x, y });
    setDrawing(true);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = x - startPosition.x;
    const height = y - startPosition.y;
    drawRect(startPosition.x, startPosition.y, width, height);
  };

  const handleMouseUp = (event) => {
    if (drawing) {
      setDrawing(false);
      const newRectangles = [...rectangles];
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = startPosition.x;
      const y = startPosition.y;
      const width = event.clientX - rect.left - startPosition.x;
      const height = event.clientY - rect.top - startPosition.y;
      newRectangles.push({ x, y, width, height });
      setRectangles(newRectangles);
    }
  };
  

  const drawRectangles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'gray'; // Set fill color to gray
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with gray
    ctx.strokeStyle = 'black';
    rectangles.forEach(rect => {
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });
  };

  const drawRect = (x, y, width, height) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawRectangles(); // Redraw previous rectangles
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, width, height);
  };

  return (
    <canvas
      ref={canvasRef}
      className="border-2 border-gray-300 bg-gray-100" // Add Tailwind CSS classes for styling
      width={window.innerWidth * 0.9}
      height={window.innerHeight * 0.9}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Canvas;
