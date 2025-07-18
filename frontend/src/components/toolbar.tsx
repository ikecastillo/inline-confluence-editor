import React, { useState, useEffect, useRef } from 'react';
import { isAiToolbarEnabled, isAdvancedFormattingEnabled, isDebugMode } from '../utils/featureFlags';

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
    try {
      // Use improved feature flag system
      setShowAiButton(isAiToolbarEnabled());
      
      if (isDebugMode()) {
        console.log('AI Toolbar enabled:', isAiToolbarEnabled());
        console.log('Advanced Formatting enabled:', isAdvancedFormattingEnabled());
      }
    } catch (error) {
      console.error('Error checking feature flags:', error);
      setShowAiButton(false);
    }
  }, []);

  useEffect(() => {
    // Handle click outside to close toolbar
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (toolbarRef.current && event.target && !toolbarRef.current.contains(event.target as Node)) {
          onClose();
        }
      } catch (error) {
        console.error('Error handling click outside:', error);
        onClose(); // Close on error to be safe
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action: string, data?: any) => {
    try {
      onAction(action, data);
    } catch (error) {
      console.error(`Error executing action ${action}:`, error);
    }
  };

  const toolbarButtons = [
    { 
      id: 'bold', 
      label: 'B', 
      title: 'Bold',
      className: 'font-bold',
      action: () => handleAction('bold')
    },
    { 
      id: 'italic', 
      label: 'I', 
      title: 'Italic',
      className: 'italic',
      action: () => handleAction('italic')
    },
    { 
      id: 'underline', 
      label: 'U', 
      title: 'Underline',
      className: 'underline',
      action: () => handleAction('underline')
    },
    { 
      id: 'link', 
      label: '🔗', 
      title: 'Add Link',
      className: '',
      action: () => handleAction('link')
    },
    { 
      id: 'code', 
      label: '</>', 
      title: 'Code',
      className: 'font-mono text-xs',
      action: () => handleAction('code')
    },
  ];

  if (showAiButton) {
    toolbarButtons.push({
      id: 'ai',
      label: '✨ Ask AI',
      title: 'Ask AI about this text',
      className: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2',
      action: () => handleAction('ai', { text: selectedText })
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
        onClick={() => {
          try {
            onClose();
          } catch (error) {
            console.error('Error closing toolbar:', error);
          }
        }}
        title="Close"
        className="px-2 py-1.5 rounded hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors duration-150"
      >
        ✕
      </button>
    </div>
  );
};

export default Toolbar; 