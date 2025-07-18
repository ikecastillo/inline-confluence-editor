/**
 * Feature flag utilities with safe defaults and multiple detection methods
 */

export interface FeatureFlags {
  enableAiToolbar: boolean;
  enableAdvancedFormatting: boolean;
  enableCustomShortcuts: boolean;
  debugMode: boolean;
}

export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: FeatureFlags;
  private initialized: boolean = false;

  private constructor() {
    this.flags = this.getDefaultFlags();
    this.initialize();
  }

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  private getDefaultFlags(): FeatureFlags {
    return {
      enableAiToolbar: false,
      enableAdvancedFormatting: true,
      enableCustomShortcuts: false,
      debugMode: false
    };
  }

  private initialize(): void {
    if (this.initialized) return;

    try {
      // Multiple detection methods for feature flags
      const flags = this.detectFeatureFlags();
      this.flags = { ...this.flags, ...flags };
      this.initialized = true;
      
      if (this.flags.debugMode) {
        console.log('Feature flags initialized:', this.flags);
      }
    } catch (error) {
      console.error('Error initializing feature flags:', error);
      // Use default flags on error
      this.flags = this.getDefaultFlags();
    }
  }

  private detectFeatureFlags(): Partial<FeatureFlags> {
    const detectedFlags: Partial<FeatureFlags> = {};

    // Method 1: Check Confluence global feature flags
    try {
      const confluenceFlags = (window as any).CONFLUENCE_FEATURE_FLAGS;
      if (confluenceFlags && typeof confluenceFlags === 'object') {
        if (typeof confluenceFlags.enableAiToolbar === 'boolean') {
          detectedFlags.enableAiToolbar = confluenceFlags.enableAiToolbar;
        }
        if (typeof confluenceFlags.enableAdvancedFormatting === 'boolean') {
          detectedFlags.enableAdvancedFormatting = confluenceFlags.enableAdvancedFormatting;
        }
        if (typeof confluenceFlags.enableCustomShortcuts === 'boolean') {
          detectedFlags.enableCustomShortcuts = confluenceFlags.enableCustomShortcuts;
        }
        if (typeof confluenceFlags.debugMode === 'boolean') {
          detectedFlags.debugMode = confluenceFlags.debugMode;
        }
      }
    } catch (error) {
      console.warn('Could not access CONFLUENCE_FEATURE_FLAGS:', error);
    }

    // Method 2: Check AJS Meta properties
    try {
      if (typeof (window as any).AJS !== 'undefined' && (window as any).AJS.Meta) {
        const ajsMeta = (window as any).AJS.Meta;
        
        // Check for AI toolbar flag
        if (ajsMeta.get('confluence.feature.ai.toolbar') === 'true') {
          detectedFlags.enableAiToolbar = true;
        }
        
        // Check for advanced formatting flag
        if (ajsMeta.get('confluence.feature.advanced.formatting') === 'true') {
          detectedFlags.enableAdvancedFormatting = true;
        }
        
        // Check for custom shortcuts flag
        if (ajsMeta.get('confluence.feature.custom.shortcuts') === 'true') {
          detectedFlags.enableCustomShortcuts = true;
        }
        
        // Check for debug mode
        if (ajsMeta.get('confluence.debug.mode') === 'true') {
          detectedFlags.debugMode = true;
        }
      }
    } catch (error) {
      console.warn('Could not access AJS.Meta:', error);
    }

    // Method 3: Check URL parameters
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('aiToolbar') === 'true') {
        detectedFlags.enableAiToolbar = true;
      }
      
      if (urlParams.get('advancedFormatting') === 'false') {
        detectedFlags.enableAdvancedFormatting = false;
      }
      
      if (urlParams.get('customShortcuts') === 'true') {
        detectedFlags.enableCustomShortcuts = true;
      }
      
      if (urlParams.get('debug') === 'true') {
        detectedFlags.debugMode = true;
      }
    } catch (error) {
      console.warn('Could not parse URL parameters:', error);
    }

    // Method 4: Check localStorage for development overrides
    try {
      const localStorageFlags = localStorage.getItem('inlineToolbarFlags');
      if (localStorageFlags) {
        const parsedFlags = JSON.parse(localStorageFlags);
        Object.assign(detectedFlags, parsedFlags);
      }
    } catch (error) {
      console.warn('Could not access localStorage flags:', error);
    }

    // Method 5: Check for environment-specific flags
    try {
      // Development environment
      if (window.location.hostname === 'localhost' || 
          window.location.hostname.includes('dev')) {
        detectedFlags.debugMode = true;
      }
      
      // Check for Confluence AI availability
      if (typeof (window as any).AP !== 'undefined' && 
          (window as any).AP.confluence && 
          (window as any).AP.confluence.ai) {
        detectedFlags.enableAiToolbar = true;
      }
    } catch (error) {
      console.warn('Could not detect environment flags:', error);
    }

    return detectedFlags;
  }

  public getFlag(flagName: keyof FeatureFlags): boolean {
    return this.flags[flagName];
  }

  public getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  public setFlag(flagName: keyof FeatureFlags, value: boolean): void {
    this.flags[flagName] = value;
    
    // Persist to localStorage for development
    if (this.flags.debugMode) {
      try {
        localStorage.setItem('inlineToolbarFlags', JSON.stringify(this.flags));
      } catch (error) {
        console.warn('Could not persist flags to localStorage:', error);
      }
    }
  }

  public refresh(): void {
    this.initialized = false;
    this.initialize();
  }

  // Convenience methods for common flags
  public isAiToolbarEnabled(): boolean {
    return this.getFlag('enableAiToolbar');
  }

  public isAdvancedFormattingEnabled(): boolean {
    return this.getFlag('enableAdvancedFormatting');
  }

  public isCustomShortcutsEnabled(): boolean {
    return this.getFlag('enableCustomShortcuts');
  }

  public isDebugMode(): boolean {
    return this.getFlag('debugMode');
  }
}

// Export singleton instance
export const featureFlags = FeatureFlagManager.getInstance();

// Export convenience functions
export const isAiToolbarEnabled = () => featureFlags.isAiToolbarEnabled();
export const isAdvancedFormattingEnabled = () => featureFlags.isAdvancedFormattingEnabled();
export const isCustomShortcutsEnabled = () => featureFlags.isCustomShortcutsEnabled();
export const isDebugMode = () => featureFlags.isDebugMode();