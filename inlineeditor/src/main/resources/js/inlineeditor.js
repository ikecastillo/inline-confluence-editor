// Wait for AJS to be available
AJS.toInit(function() {
    // Check if we're in edit mode
    if (AJS.Meta && (AJS.Meta.get('editor-mode') === 'edit' || 
        AJS.Meta.get('editor-mode') === 'create' ||
        window.location.href.includes('editpage.action') ||
        window.location.href.includes('createpage.action'))) {
        
        console.log('Inline toolbar: Initializing in edit mode');
        
        // Load the inline toolbar script
        var script = document.createElement('script');
        script.src = AJS.contextPath() + '/download/resources/com.example.confluence.inlineeditor/inline-toolbar.js';
        script.onload = function() {
            console.log('Inline toolbar: Script loaded successfully');
        };
        script.onerror = function() {
            console.error('Inline toolbar: Failed to load script');
        };
        document.head.appendChild(script);
        
        // Load the inline toolbar CSS
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = AJS.contextPath() + '/download/resources/com.example.confluence.inlineeditor/inline-toolbar.css';
        document.head.appendChild(link);
    }
});
