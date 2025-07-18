import React from 'react';
import ReactDOM from 'react-dom/client';
import Toolbar from './components/toolbar';
import ErrorBoundary from './components/ErrorBoundary';
import { editorCommands } from './utils/editorCommands';
import './styles/main.css';

interface SelectionInfo {
  text: string;
  range: Range;
  rect: DOMRect;
}

class InlineToolbarManager {
  private container: HTMLDivElement | null = null;
  private root: ReactDOM.Root | null = null;
  private currentSelection: SelectionInfo | null = null;
  private isInitialized: boolean = false;
  private errorCount: number = 0;
  private maxErrors: number = 5;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Prevent multiple initializations
      if (this.isInitialized) {
        console.warn('InlineToolbarManager already initialized');
        return;
      }

      // Verify DOM is ready
      if (!document.body) {
        console.warn('DOM not ready, retrying initialization...');
        setTimeout(() => this.initialize(), 100);
        return;
      }

      // Create container for React toolbar
      this.container = document.createElement('div');
      this.container.id = 'inline-toolbar-container';
      this.container.style.position = 'absolute';
      this.container.style.zIndex = '9999';
      this.container.style.pointerEvents = 'none';
      document.body.appendChild(this.container);
      this.root = ReactDOM.createRoot(this.container);

      // Listen for text selection in Confluence editor
      document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
      document.addEventListener('mouseup', this.handleMouseUp.bind(this));
      
      this.isInitialized = true;
      console.log('InlineToolbarManager initialized successfully');
    } catch (error) {
      this.handleError('Failed to initialize InlineToolbarManager', error);
    }
  }

  private handleSelectionChange() {
    try {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        this.hideToolbar();
        return;
      }
    } catch (error) {
      this.handleError('Error in handleSelectionChange', error);
    }
  }

  private handleMouseUp(event: MouseEvent) {
    try {
      // Only process selection in editor area
      const target = event.target as HTMLElement;
      if (!this.isInEditor(target)) {
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        return;
      }

      if (selection.rangeCount === 0) {
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      this.currentSelection = {
        text: selection.toString(),
        range: range,
        rect: rect
      };

      this.showToolbar();
    } catch (error) {
      this.handleError('Error in handleMouseUp', error);
    }
  }

  private isInEditor(element: HTMLElement): boolean {
    try {
      // Null check
      if (!element || !element.closest) {
        return false;
      }

      // Check if element is within Confluence editor
      const editorSelectors = [
        '.synchrony-content',
        '#tinymce',
        '[contenteditable="true"]',
        '.editor-content-area',
        '#content-area-panel'
      ];

      return editorSelectors.some(selector => {
        try {
          return element.closest(selector) !== null;
        } catch (e) {
          return false;
        }
      });
    } catch (error) {
      this.handleError('Error in isInEditor', error);
      return false;
    }
  }

  private showToolbar() {
    try {
      if (!this.currentSelection || !this.root) return;

      const { rect, text } = this.currentSelection;
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY
      };

      this.root.render(
        <ErrorBoundary
          onError={(error, errorInfo) => this.handleError('Toolbar render error', error)}
          fallback={
            <div style={{
              position: 'absolute',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              color: '#856404'
            }}>
              Toolbar Error
            </div>
          }
        >
          <Toolbar
            selectedText={text}
            position={position}
            onAction={this.handleToolbarAction.bind(this)}
            onClose={this.hideToolbar.bind(this)}
          />
        </ErrorBoundary>
      );
    } catch (error) {
      this.handleError('Error in showToolbar', error);
    }
  }

  private hideToolbar() {
    try {
      if (this.root) {
        this.root.render(<></>);
      }
      this.currentSelection = null;
    } catch (error) {
      this.handleError('Error in hideToolbar', error);
    }
  }

  private handleToolbarAction(action: string, data?: any) {
    try {
      if (!this.currentSelection) return;

      const { range } = this.currentSelection;
      
      // Restore selection
      const selection = window.getSelection();
      if (!selection) {
        console.warn('No selection available for toolbar action');
        return;
      }
      
      selection.removeAllRanges();
      selection.addRange(range);

      // Execute action using modern editor commands
      switch (action) {
        case 'bold':
          editorCommands.executeCommand('bold', selection, range);
          break;
        case 'italic':
          editorCommands.executeCommand('italic', selection, range);
          break;
        case 'underline':
          editorCommands.executeCommand('underline', selection, range);
          break;
        case 'code':
          editorCommands.executeCommand('code', selection, range);
          break;
        case 'link':
          this.promptForLink(selection, range);
          break;
        case 'ai':
          this.handleAiAction(data);
          break;
        default:
          console.warn(`Unknown toolbar action: ${action}`);
      }

      this.hideToolbar();
    } catch (error) {
      this.handleError('Error in handleToolbarAction', error);
    }
  }

  private wrapInCode() {
    try {
      // This method is now handled by editorCommands.executeCommand('code')
      // Keeping for backward compatibility
      const selection = window.getSelection();
      if (!selection || !selection.toString() || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      editorCommands.executeCommand('code', selection, range);
    } catch (error) {
      this.handleError('Error in wrapInCode', error);
    }
  }

  private promptForLink(selection: Selection, range: Range) {
    try {
      const url = prompt('Enter URL:');
      if (url) {
        editorCommands.executeCommand('link', selection, range, url);
      }
    } catch (error) {
      this.handleError('Error in promptForLink', error);
    }
  }

  private handleAiAction(data: { text: string }) {
    try {
      // Placeholder for AI functionality
      console.log('AI action triggered with text:', data.text);
      // This would integrate with Confluence's AI features when available
    } catch (error) {
      this.handleError('Error in handleAiAction', error);
    }
  }

  private handleError(message: string, error: any) {
    this.errorCount++;
    
    // Log error for debugging
    console.error(`InlineToolbarManager Error: ${message}`, error);
    
    // If too many errors, disable the toolbar
    if (this.errorCount > this.maxErrors) {
      console.error('Too many errors, disabling inline toolbar');
      this.destroy();
      return;
    }
    
    // Hide toolbar on error to prevent cascading issues
    this.hideToolbar();
  }

  public destroy() {
    try {
      // Remove event listeners
      document.removeEventListener('selectionchange', this.handleSelectionChange.bind(this));
      document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
      
      // Clean up React root
      if (this.root) {
        this.root.unmount();
        this.root = null;
      }
      
      // Remove container
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }
      
      this.isInitialized = false;
      this.currentSelection = null;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new InlineToolbarManager();
  });
} else {
  new InlineToolbarManager();
}

// Export for global access if needed
(window as any).InlineToolbar = InlineToolbarManager; 