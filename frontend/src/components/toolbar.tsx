import React, { useState, useEffect, useRef } from 'react';

interface ToolbarProps {
  selectedText: string;
  position: { x: number; y: number };
  onAction: (action: string, data?: any) => void;
  onClose: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedText, position, onAction, onClose }) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showAiButton, setShowAiButton] = useState(false);

  useEffect(() => {
    // Check for feature flag from Confluence
    const featureFlags = (window as any).CONFLUENCE_FEATURE_FLAGS || {};
    setShowAiButton(featureFlags.enableAiToolbar === true);
  }, []);

  useEffect(() => {
    // Handle click outside to close toolbar
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toolbarButtons = [
    { 
      id: 'bold', 
      label: 'B', 
      title: 'Bold',
      className: 'font-bold',
      action: () => onAction('bold')
    },
    { 
      id: 'italic', 
      label: 'I', 
      title: 'Italic',
      className: 'italic',
      action: () => onAction('italic')
    },
    { 
      id: 'underline', 
      label: 'U', 
      title: 'Underline',
      className: 'underline',
      action: () => onAction('underline')
    },
    { 
      id: 'link', 
      label: '🔗', 
      title: 'Add Link',
      className: '',
      action: () => onAction('link')
    },
    { 
      id: 'code', 
      label: '</>', 
      title: 'Code',
      className: 'font-mono text-xs',
      action: () => onAction('code')
    },
  ];

  if (showAiButton) {
    toolbarButtons.push({
      id: 'ai',
      label: '✨ Ask AI',
      title: 'Ask AI about this text',
      className: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2',
      action: () => onAction('ai', { text: selectedText })
    });
  }

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-1 flex items-center space-x-1"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 20}px`,
        transform: 'translateX(-50%)'
      }}
    >
      {toolbarButtons.map((button) => (
        <button
          key={button.id}
          onClick={button.action}
          title={button.title}
          className={`
            px-3 py-1.5 rounded hover:bg-confluence-light-gray 
            transition-colors duration-150 text-confluence-gray
            hover:text-confluence-blue focus:outline-none focus:ring-2 
            focus:ring-confluence-blue focus:ring-opacity-50
            ${button.className}
          `}
        >
          {button.label}
        </button>
      ))}
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button
        onClick={onClose}
        title="Close"
        className="px-2 py-1.5 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors duration-150"
      >
        ✕
      </button>
    </div>
  );
};

export default Toolbar; 