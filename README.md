# Confluence Inline Editor Plugin

A Confluence Data Center plugin that adds a custom inline toolbar to the editor when text is selected.

## Features

- **Inline Toolbar**: Appears when text is selected in the Confluence editor
- **Rich Text Formatting**: Bold, Italic, Underline, Link, and Code formatting
- **AI Integration Ready**: Placeholder for AI functionality (feature-flagged)
- **Modern UI**: Built with React 18.2.0, TypeScript, and Tailwind CSS
- **Responsive Design**: Works across different Confluence editor contexts

## Project Structure

```
inline-confluence-editor/
├── frontend/                    # React/TypeScript frontend module
│   ├── src/
│   │   ├── components/
│   │   │   └── toolbar.tsx     # Main toolbar component
│   │   ├── styles/
│   │   │   └── main.css        # Tailwind CSS styles
│   │   ├── i18n/
│   │   │   └── inline-toolbar.properties
│   │   └── index.tsx           # Entry point
│   ├── package.json
│   ├── webpack.config.js
│   └── tsconfig.json
├── inlineeditor/               # Main plugin module
│   ├── src/main/resources/
│   │   ├── atlassian-plugin.xml
│   │   ├── js/
│   │   │   ├── inlineeditor.js
│   │   │   └── inline-toolbar.js (built)
│   │   └── css/
│   │       └── inline-toolbar.css (built)
│   └── pom.xml
├── pom.xml                     # Root Maven configuration
├── planning.md                 # Project tracking document
└── README.md                   # This file
```

## Prerequisites

- **Java 11+**
- **Node.js 16.14.0+** (for frontend build)
- **Atlassian Plugin SDK 8.14.3**
- **Confluence 8.5.4**

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd inline-confluence-editor
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Build the project:**
   ```bash
   atlas-mvn clean package
   ```

## Running in Development Mode

Start a local Confluence instance with the plugin installed:

```bash
atlas-run
```

This will:
- Start Confluence on `http://localhost:1990/confluence`
- Install the plugin automatically
- Enable hot reloading for development

## Building for Production

1. **Build the plugin:**
   ```bash
   atlas-mvn clean package
   ```

2. **Find the plugin JAR:**
   ```
   inlineeditor/target/inlineeditor-1.0.0-SNAPSHOT.jar
   ```

3. **Install on Confluence:**
   - Go to Confluence Administration → Manage Apps
   - Upload the JAR file
   - Enable the plugin

## Testing the Plugin

1. **Create or edit a page** in Confluence
2. **Select text** in the editor
3. **Verify the toolbar appears** below the selection
4. **Test all buttons:**
   - **Bold** (B)
   - **Italic** (I)
   - **Underline** (U)
   - **Link** (🔗)
   - **Code** (</>)

## AI Feature

The AI button is hidden by default and can be enabled via feature flag:

```javascript
// Enable AI feature
window.CONFLUENCE_FEATURE_FLAGS = {
  enableAiToolbar: true
};
```

## Development Commands

### Frontend Development
```bash
cd frontend
npm run build          # Build for production
npm run build:dev      # Build for development
npm run watch          # Watch mode for development
```

### Maven Commands
```bash
atlas-mvn clean        # Clean build artifacts
atlas-mvn package      # Build plugin JAR
atlas-mvn install      # Install to local Maven repository
atlas-run              # Run with plugin installed
atlas-debug            # Run in debug mode
```

## Configuration

### Plugin Configuration
The plugin is configured via `inlineeditor/src/main/resources/atlassian-plugin.xml`:

- **Web Resources**: CSS and JavaScript files
- **Contexts**: `editor`, `editor-content`
- **Dependencies**: Confluence editor resources

### Frontend Configuration
- **Webpack**: Bundles React and CSS
- **TypeScript**: Strict type checking
- **Tailwind CSS**: Utility-first styling
- **Output**: `frontend/src/main/resources/`

## Troubleshooting

### Build Issues
- **Maven version**: Ensure you're using Maven 3.5.4+ (comes with Atlassian SDK)
- **Node.js version**: Use Node.js 16.14.0+ for frontend builds
- **Java version**: Use Java 11+ for compilation

### Plugin Not Loading
- Check browser console for JavaScript errors
- Verify plugin is enabled in Confluence Admin
- Check that web resources are loading correctly

### Toolbar Not Appearing
- Ensure you're in edit mode
- Check that text selection is working
- Verify React is loading properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the planning.md file for implementation details
- Create an issue in the repository 