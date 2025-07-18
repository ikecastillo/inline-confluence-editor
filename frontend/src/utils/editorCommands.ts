/**
 * Modern editor commands to replace deprecated document.execCommand
 */

interface EditorCommand {
  execute(selection: Selection, range: Range, ...args: any[]): boolean;
  isSupported(): boolean;
}

/**
 * Apply bold formatting using modern Selection API
 */
export class BoldCommand implements EditorCommand {
  execute(selection: Selection, range: Range): boolean {
    try {
      // Check if execCommand is still supported as fallback
      if (document.queryCommandSupported && document.queryCommandSupported('bold')) {
        return document.execCommand('bold', false);
      }
      
      // Modern approach using Selection API
      const selectedText = range.toString();
      if (!selectedText) return false;
      
      const strong = document.createElement('strong');
      strong.textContent = selectedText;
      
      range.deleteContents();
      range.insertNode(strong);
      
      // Update selection to include the new node
      range.selectNodeContents(strong);
      selection.removeAllRanges();
      selection.addRange(range);
      
      return true;
    } catch (error) {
      console.error('Error applying bold formatting:', error);
      return false;
    }
  }
  
  isSupported(): boolean {
    return typeof document.createElement !== 'undefined';
  }
}

/**
 * Apply italic formatting using modern Selection API
 */
export class ItalicCommand implements EditorCommand {
  execute(selection: Selection, range: Range): boolean {
    try {
      // Check if execCommand is still supported as fallback
      if (document.queryCommandSupported && document.queryCommandSupported('italic')) {
        return document.execCommand('italic', false);
      }
      
      // Modern approach using Selection API
      const selectedText = range.toString();
      if (!selectedText) return false;
      
      const em = document.createElement('em');
      em.textContent = selectedText;
      
      range.deleteContents();
      range.insertNode(em);
      
      // Update selection to include the new node
      range.selectNodeContents(em);
      selection.removeAllRanges();
      selection.addRange(range);
      
      return true;
    } catch (error) {
      console.error('Error applying italic formatting:', error);
      return false;
    }
  }
  
  isSupported(): boolean {
    return typeof document.createElement !== 'undefined';
  }
}

/**
 * Apply underline formatting using modern Selection API
 */
export class UnderlineCommand implements EditorCommand {
  execute(selection: Selection, range: Range): boolean {
    try {
      // Check if execCommand is still supported as fallback
      if (document.queryCommandSupported && document.queryCommandSupported('underline')) {
        return document.execCommand('underline', false);
      }
      
      // Modern approach using Selection API
      const selectedText = range.toString();
      if (!selectedText) return false;
      
      const u = document.createElement('u');
      u.textContent = selectedText;
      
      range.deleteContents();
      range.insertNode(u);
      
      // Update selection to include the new node
      range.selectNodeContents(u);
      selection.removeAllRanges();
      selection.addRange(range);
      
      return true;
    } catch (error) {
      console.error('Error applying underline formatting:', error);
      return false;
    }
  }
  
  isSupported(): boolean {
    return typeof document.createElement !== 'undefined';
  }
}

/**
 * Create a link using modern Selection API
 */
export class LinkCommand implements EditorCommand {
  execute(selection: Selection, range: Range, url: string): boolean {
    try {
      // Validate URL
      if (!url || typeof url !== 'string') {
        return false;
      }
      
      // Check if execCommand is still supported as fallback
      if (document.queryCommandSupported && document.queryCommandSupported('createLink')) {
        return document.execCommand('createLink', false, url);
      }
      
      // Modern approach using Selection API
      const selectedText = range.toString();
      if (!selectedText) return false;
      
      const a = document.createElement('a');
      a.href = url;
      a.textContent = selectedText;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      
      range.deleteContents();
      range.insertNode(a);
      
      // Update selection to include the new node
      range.selectNodeContents(a);
      selection.removeAllRanges();
      selection.addRange(range);
      
      return true;
    } catch (error) {
      console.error('Error creating link:', error);
      return false;
    }
  }
  
  isSupported(): boolean {
    return typeof document.createElement !== 'undefined';
  }
}

/**
 * Wrap text in code tags using modern Selection API
 */
export class CodeCommand implements EditorCommand {
  execute(selection: Selection, range: Range): boolean {
    try {
      const selectedText = range.toString();
      if (!selectedText) return false;
      
      const code = document.createElement('code');
      code.textContent = selectedText;
      
      range.deleteContents();
      range.insertNode(code);
      
      // Update selection to include the new node
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      
      return true;
    } catch (error) {
      console.error('Error applying code formatting:', error);
      return false;
    }
  }
  
  isSupported(): boolean {
    return typeof document.createElement !== 'undefined';
  }
}

/**
 * Editor command factory and utilities
 */
export class EditorCommandManager {
  private commands: Map<string, EditorCommand>;
  
  constructor() {
    this.commands = new Map();
    this.commands.set('bold', new BoldCommand());
    this.commands.set('italic', new ItalicCommand());
    this.commands.set('underline', new UnderlineCommand());
    this.commands.set('link', new LinkCommand());
    this.commands.set('code', new CodeCommand());
  }
  
  /**
   * Execute a command by name
   */
  executeCommand(commandName: string, selection: Selection, range: Range, ...args: any[]): boolean {
    const command = this.commands.get(commandName);
    if (!command) {
      console.warn(`Unknown command: ${commandName}`);
      return false;
    }
    
    if (!command.isSupported()) {
      console.warn(`Command not supported: ${commandName}`);
      return false;
    }
    
    return command.execute(selection, range, ...args);
  }
  
  /**
   * Check if a command is supported
   */
  isCommandSupported(commandName: string): boolean {
    const command = this.commands.get(commandName);
    return command ? command.isSupported() : false;
  }
  
  /**
   * Get all supported commands
   */
  getSupportedCommands(): string[] {
    return Array.from(this.commands.keys()).filter(name => 
      this.isCommandSupported(name)
    );
  }
}

// Export a singleton instance
export const editorCommands = new EditorCommandManager();