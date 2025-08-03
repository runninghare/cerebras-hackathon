
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
  className="flex flex-col h-screen bg-slate-900 container mx-auto max-w-6xl"
>

<header className="text-center py-6 bg-gradient-to-b from-slate-800 to-slate-900 shadow-md rounded-t-xl border-b border-gray-700/50">
  <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
    Cerebras x Cline: $5,000 Vibe Coder Hackathon
  </h1>
  <h2 className="text-2xl font-medium text-gray-700 tracking-wide">
    飞向天空的狮子
  </h2>
</header>
{/* Top section (2/3 viewport height) */}
<div className="flex flex-1" style={{ height: '66.67vh' }}>
        {/* Left pane */}
        <div 
          className="flex-1 border-r border-gray-700/50 rounded-tl-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-sm hover:border-indigo-400/70 hover:shadow-lg hover:ring-1 hover:ring-indigo-400/20 transition-all duration-200 group"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="h-full flex flex-col items-center justify-center text-gray-200 font-medium p-4 group-hover:text-indigo-300 transition-colors duration-200">
            Top Left View
          </div>
        </div>
        
        {/* Vertical splitter */}
        <div 
          className="w-1.5 bg-gray-600/50 hover:bg-indigo-400/30 cursor-col-resize group"
          onMouseDown={handleVerticalDrag}
        >
          <div className="w-4 h-full -ml-1.5 bg-gray-700/0 group-hover:bg-indigo-300/50 transition-colors" />
        </div>
        
        {/* Right pane */}
<div 
  className="flex-1 border-l border-gray-700/50 rounded-tr-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-sm hover:border-indigo-400/70 hover:shadow-lg hover:ring-1 hover:ring-indigo-400/20 transition-all duration-200 group"
  style={{ width: `${100 - leftWidth}%` }}
>
          <div className="h-full flex flex-col items-center justify-center text-gray-200 font-medium p-4 group-hover:text-indigo-300 transition-colors duration-200">
            Top Right View
          </div>
        </div>
      </div>
      
      {/* Horizontal splitter */}
      <div 
        className="h-1.5 bg-gray-600/50 hover:bg-indigo-400/30 cursor-row-resize group"
        onMouseDown={handleHorizontalDrag}
      >
        <div className="h-4 w-full -mt-1.5 bg-gray-700/0 group-hover:bg-indigo-300/50 transition-colors" />
      </div>
      
      {/* Bottom section (1/3 viewport height) */}
<div 
  className="flex-1 border-t border-gray-700/50 rounded-b-xl bg-gradient-to-tl from-slate-800 to-slate-900 shadow-sm hover:border-indigo-400/70 hover:shadow-lg hover:ring-1 hover:ring-indigo-400/20 transition-all duration-200 group"
  style={{ height: '33.33vh' }}
>
  <div className="h-full p-6 text-gray-200">
    <h2 className="text-xl font-bold mb-3 text-white flex items-center">
      <span className="inline-block w-2 h-2 bg-indigo-300 rounded-full mr-2" />
      Explanation Panel
    </h2>
    <p className="text-base leading-relaxed">
      This panel provides contextual information and explanations about the content shown in the top panes. 
      Resize the borders by dragging the subtle dividers between sections - they expand slightly on hover for easier interaction.
    </p>
    <div className="mt-4 p-3 bg-indigo-900/30 rounded-lg border border-indigo-700/50">
      <p className="text-sm text-indigo-200 font-medium">Tip: Drag the dividers to adjust pane sizes</p>
    </div>
  </div>
</div>
    </div>
  );
}

export default App;
