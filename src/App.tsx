
import { useState, useRef } from 'react';

function App() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [topHeight, setTopHeight] = useState(66.67);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    
    const startX = e.clientX;
    const containerRect = container.getBoundingClientRect();
    const startWidth = leftWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const containerWidth = containerRect.width;
      const newWidth = startWidth + (diff / containerWidth) * 100;
      
      if (newWidth > 10 && newWidth < 90) {
        setLeftWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleHorizontalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    
    const startY = e.clientY;
    const containerRect = container.getBoundingClientRect();
    const startHeight = topHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientY - startY;
      const containerHeight = containerRect.height;
      const newHeight = startHeight - (diff / containerHeight) * 100;
      
      if (newHeight > 10 && newHeight < 90) {
        setTopHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-screen bg-gray-50 container mx-auto max-w-6xl"
    >
      {/* Top section (2/3 viewport height) */}
      <div className="flex flex-1" style={{ height: '66.67vh' }}>
        {/* Left pane */}
        <div 
          className="flex-1 border-r border-gray-200/70 rounded-tl-xl bg-white shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all duration-200"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="h-full flex items-center justify-center text-gray-500 font-medium">
            Top Left View
          </div>
        </div>
        
        {/* Vertical splitter */}
        <div 
          className="w-1.5 bg-gray-200/50 hover:bg-indigo-500/30 cursor-col-resize group"
          onMouseDown={handleVerticalDrag}
        >
          <div className="w-4 h-full -ml-1.5 bg-gray-300/0 group-hover:bg-indigo-100/50 transition-colors" />
        </div>
        
        {/* Right pane */}
        <div 
          className="flex-1 border-l border-gray-200/70 rounded-tr-xl bg-white shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all duration-200"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="h-full flex items-center justify-center text-gray-500 font-medium">
            Top Right View
          </div>
        </div>
      </div>
      
      {/* Horizontal splitter */}
      <div 
        className="h-1.5 bg-gray-200/50 hover:bg-indigo-500/30 cursor-row-resize group"
        onMouseDown={handleHorizontalDrag}
      >
        <div className="h-4 w-full -mt-1.5 bg-gray-300/0 group-hover:bg-indigo-100/50 transition-colors" />
      </div>
      
      {/* Bottom section (1/3 viewport height) */}
      <div 
        className="flex-1 border-t border-gray-200/70 rounded-b-xl bg-white shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all duration-200"
        style={{ height: '33.33vh' }}
      >
        <div className="h-full p-6 text-gray-700">
          <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2" />
            Explanation Panel
          </h2>
          <p className="text-base leading-relaxed">
            This panel provides contextual information and explanations about the content shown in the top panes. 
            Resize the borders by dragging the subtle dividers between sections - they expand slightly on hover for easier interaction.
          </p>
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-sm text-indigo-700 font-medium">Tip: Drag the dividers to adjust pane sizes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
