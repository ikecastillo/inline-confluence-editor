import React from 'react';
import ReactDOM from 'react-dom/client';
import Toolbar from './components/toolbar';
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

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Create container for React toolbar
    this.container = document.createElement('div');
    this.container.id = 'inline-toolbar-container';
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);

    // Listen for text selection in Confluence editor
    document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleSelectionChange() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      this.hideToolbar();
      return;
    }
  }

  private handleMouseUp(event: MouseEvent) {
    // Only process selection in editor area
    const target = event.target as HTMLElement;
    if (!this.isInEditor(target)) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
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
  }

  private isInEditor(element: HTMLElement): boolean {
    // Check if element is within Confluence editor
    const editorSelectors = [
      '.synchrony-content',
      '#tinymce',
      '[contenteditable="true"]',
      '.editor-content-area',
      '#content-area-panel'
    ];

    return editorSelectors.some(selector => 
      element.closest(selector) !== null
    );
  }

  private showToolbar() {
    if (!this.currentSelection || !this.root) return;

    const { rect, text } = this.currentSelection;
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY
    };

    this.root.render(
      <Toolbar
        selectedText={text}
        position={position}
        onAction={this.handleToolbarAction.bind(this)}
        onClose={this.hideToolbar.bind(this)}
      />
    );
  }

  private hideToolbar() {
    if (this.root) {
      this.root.render(<></>);
    }
    this.currentSelection = null;
  }

  private handleToolbarAction(action: string, data?: any) {
    if (!this.currentSelection) return;

    const { range } = this.currentSelection;
    
    // Restore selection
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Execute action
    switch (action) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'code':
        this.wrapInCode();
        break;
      case 'link':
        this.promptForLink();
        break;
      case 'ai':
        this.handleAiAction(data);
        break;
    }

    this.hideToolbar();
  }

  private wrapInCode() {
    // Wrap selection in <code> tags for Confluence
    const selection = window.getSelection();
    if (!selection || !selection.toString()) return;

    const range = selection.getRangeAt(0);
    const code = document.createElement('code');
    code.textContent = selection.toString();
    
    range.deleteContents();
    range.insertNode(code);
  }

  private promptForLink() {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  private handleAiAction(data: { text: string }) {
    // Placeholder for AI functionality
    console.log('AI action triggered with text:', data.text);
    // This would integrate with Confluence's AI features when available
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