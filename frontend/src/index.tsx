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
    console.log('[ITM-INIT-001] InlineToolbarManager constructor called');
    this.initialize();
  }

  private initialize() {
    try {
      console.log('[ITM-INIT-002] Starting initialization...');
      
      // Prevent multiple initializations
      if (this.isInitialized) {
        console.warn('[ITM-INIT-003] InlineToolbarManager already initialized');
        return;
      }

      // Verify DOM is ready
      if (!document.body) {
        console.warn('[ITM-INIT-004] DOM not ready, retrying initialization...');
        setTimeout(() => this.initialize(), 100);
        return;
      }

      console.log('[ITM-INIT-005] DOM ready, creating container...');

      // Create container for React toolbar
      this.container = document.createElement('div');
      this.container.id = 'inline-toolbar-container';
      this.container.style.position = 'absolute';
      this.container.style.zIndex = '9999';
      this.container.style.pointerEvents = 'none';
      this.container.style.display = 'none'; // Initially hidden
      this.container.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // DEBUG: red background
      this.container.style.border = '2px solid red'; // DEBUG: red border
      this.container.style.minWidth = '200px'; // DEBUG: min width
      this.container.style.minHeight = '50px'; // DEBUG: min height
      document.body.appendChild(this.container);
      this.root = ReactDOM.createRoot(this.container);

      console.log('[ITM-INIT-006] Container created and added to DOM, container:', this.container);

      // Listen for text selection in Confluence editor
      document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
      document.addEventListener('mouseup', this.handleMouseUp.bind(this));
      
      console.log('[ITM-INIT-007] Event listeners added');
      
      this.isInitialized = true;
      console.log('[ITM-INIT-008] InlineToolbarManager initialized successfully');
    } catch (error) {
      console.error('[ITM-INIT-009] Initialization failed:', error);
      this.handleError('Failed to initialize InlineToolbarManager', error);
    }
  }

  private handleSelectionChange() {
    try {
      console.log('[ITM-SEL-001] Selection change detected');
      const selection = window.getSelection();
      
      if (!selection) {
        console.log('[ITM-SEL-002] No selection object');
        this.hideToolbar();
        return;
      }
      
      console.log('[ITM-SEL-003] Selection details:', {
        isCollapsed: selection.isCollapsed,
        text: selection.toString(),
        rangeCount: selection.rangeCount
      });
      
      if (selection.isCollapsed || !selection.toString().trim()) {
        console.log('[ITM-SEL-004] Selection is collapsed or empty, hiding toolbar');
        this.hideToolbar();
        return;
      }
      
      console.log('[ITM-SEL-005] Valid selection found, text:', selection.toString());
    } catch (error) {
      console.error('[ITM-SEL-006] Error in handleSelectionChange:', error);
      this.handleError('Error in handleSelectionChange', error);
    }
  }

  private handleMouseUp(event: MouseEvent) {
    try {
      console.log('[ITM-MOUSE-001] Mouse up detected at:', event.clientX, event.clientY);
      
      // Only process selection in editor area
      const target = event.target as HTMLElement;
      console.log('[ITM-MOUSE-002] Target element:', target?.tagName, target?.className);
      
      const isInEditor = this.isInEditor(target);
      console.log('[ITM-MOUSE-003] Is in editor:', isInEditor);
      
      if (!isInEditor) {
        console.log('[ITM-MOUSE-004] Not in editor, ignoring');
        return;
      }

      const selection = window.getSelection();
      console.log('[ITM-MOUSE-005] Selection after mouseup:', {
        selection: !!selection,
        isCollapsed: selection?.isCollapsed,
        text: selection?.toString(),
        rangeCount: selection?.rangeCount
      });
      
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        console.log('[ITM-MOUSE-006] No valid selection, returning');
        return;
      }

      if (selection.rangeCount === 0) {
        console.log('[ITM-MOUSE-007] No ranges in selection');
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      console.log('[ITM-MOUSE-008] Range rect:', {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      });
      
      this.currentSelection = {
        text: selection.toString(),
        range: range,
        rect: rect
      };

      console.log('[ITM-MOUSE-009] Calling showToolbar with selection:', this.currentSelection.text);
      this.showToolbar();
    } catch (error) {
      console.error('[ITM-MOUSE-010] Error in handleMouseUp:', error);
      this.handleError('Error in handleMouseUp', error);
    }
  }

  private isInEditor(element: HTMLElement): boolean {
    try {
      console.log('[ITM-EDITOR-001] Checking if element is in editor:', element?.tagName, element?.className);
      
      // Null check
      if (!element || !element.closest) {
        console.log('[ITM-EDITOR-002] Element is null or has no closest method');
        return false;
      }

      // Check if element is within Confluence editor
      const editorSelectors = [
        '.synchrony-content',
        '#tinymce',
        '[contenteditable="true"]',
        '.editor-content-area',
        '#content-area-panel',
        '.ProseMirror', // Modern Confluence editor
        '.confluence-editor' // Additional selector
      ];

      console.log('[ITM-EDITOR-003] Checking selectors:', editorSelectors);

      for (const selector of editorSelectors) {
        try {
          const found = element.closest(selector);
          console.log(`[ITM-EDITOR-004] Selector "${selector}": ${found ? 'FOUND' : 'not found'}`);
          if (found) {
            console.log('[ITM-EDITOR-005] Element IS in editor via selector:', selector);
            return true;
          }
        } catch (e) {
          console.log(`[ITM-EDITOR-006] Error checking selector "${selector}":`, e);
        }
      }
      
      console.log('[ITM-EDITOR-007] Element is NOT in editor');
      return false;
    } catch (error) {
      console.error('[ITM-EDITOR-008] Error in isInEditor:', error);
      this.handleError('Error in isInEditor', error);
      return false;
    }
  }

  private showToolbar() {
    try {
      console.log('[ITM-SHOW-001] showToolbar called');
      
      if (!this.currentSelection) {
        console.log('[ITM-SHOW-002] No current selection');
        return;
      }
      
      if (!this.root) {
        console.log('[ITM-SHOW-003] No React root');
        return;
      }

      const { rect, text } = this.currentSelection;
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY
      };

      console.log('[ITM-SHOW-004] Toolbar position calculated:', position);
      console.log('[ITM-SHOW-005] Selected text:', text);
      console.log('[ITM-SHOW-006] Container element:', this.container);
      console.log('[ITM-SHOW-007] Container visible?', this.container?.offsetWidth, this.container?.offsetHeight);

      // Make container visible and position it
      if (this.container) {
        this.container.style.display = 'block'; // Show container
        this.container.style.pointerEvents = 'auto';
        this.container.style.left = position.x + 'px';
        this.container.style.top = position.y + 'px';
        console.log('[ITM-SHOW-008] Container positioned at:', position.x, position.y);
      }

      console.log('[ITM-SHOW-009] Rendering toolbar component...');

      this.root.render(
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('[ITM-SHOW-010] Toolbar render error:', error, errorInfo);
            this.handleError('Toolbar render error', error);
          }}
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
      
      console.log('[ITM-SHOW-011] Toolbar rendered successfully');
    } catch (error) {
      console.error('[ITM-SHOW-012] Error in showToolbar:', error);
      this.handleError('Error in showToolbar', error);
    }
  }

  private hideToolbar() {
    try {
      console.log('[ITM-HIDE-001] hideToolbar called');
      if (this.container) {
        this.container.style.display = 'none'; // Hide container
      }
      if (this.root) {
        this.root.render(<></>);
        console.log('[ITM-HIDE-002] Toolbar hidden');
      }
      this.currentSelection = null;
    } catch (error) {
      console.error('[ITM-HIDE-003] Error in hideToolbar:', error);
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

console.log('[ITM-LOAD-001] Inline toolbar module loaded, document.readyState:', document.readyState);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('[ITM-LOAD-002] Document still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[ITM-LOAD-003] DOMContentLoaded fired, creating InlineToolbarManager');
    new InlineToolbarManager();
  });
} else {
  console.log('[ITM-LOAD-004] Document ready, creating InlineToolbarManager immediately');
  new InlineToolbarManager();
}

// Export for global access if needed
(window as any).InlineToolbar = InlineToolbarManager;
console.log('[ITM-LOAD-005] InlineToolbar exported to window'); 