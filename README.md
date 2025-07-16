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
├── .gitignore                    # Git ignore rules for build artifacts
├── README.md                     # This documentation
├── planning.md                   # Project tracking and progress
├── pom.xml                       # Root Maven configuration (multi-module)
├── frontend/                     # React/TypeScript frontend module
│   ├── package.json              # Node.js dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── webpack.config.js         # Webpack build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── pom.xml                   # Frontend Maven module config
│   └── src/
│       ├── components/
│       │   └── toolbar.tsx       # Main React toolbar component
│       ├── styles/
│       │   └── main.css          # Tailwind CSS imports and custom styles
│       ├── i18n/
│       │   └── inline-toolbar.properties  # Internationalization strings
│       └── index.tsx             # Entry point for React application
├── inlineeditor/                 # Main Confluence plugin module
│   ├── pom.xml                   # Plugin Maven configuration
│   └── src/main/resources/
│       ├── atlassian-plugin.xml  # Plugin descriptor and web resources
│       ├── inlineeditor.properties # Plugin properties
│       ├── js/
│       │   ├── inlineeditor.js   # Plugin initialization script
│       │   └── inline-toolbar.js # Built React application (141 KiB)
│       ├── css/
│       │   ├── inlineeditor.css  # Plugin CSS (empty placeholder)
│       │   └── inline-toolbar.css # Built Tailwind CSS (14.9 KiB)
│       ├── images/
│       │   ├── pluginIcon.png    # Plugin icon
│       │   └── pluginLogo.png    # Plugin logo
│       ├── i18n/
│       │   └── inline-toolbar.properties # Copied i18n files
│       └── META-INF/spring/
│           └── plugin-context.xml # Spring configuration
└── target/                       # Maven build output (ignored by git)
    └── inlineeditor-1.0.0-SNAPSHOT.jar # Final plugin JAR
```

## Expected Project Skeleton

When you clone or create this project, you should expect:

### **Root Level Files**
- ✅ `.gitignore` - Comprehensive ignore rules for Maven, Node.js, IDE files
- ✅ `README.md` - Complete documentation
- ✅ `planning.md` - Project tracking and progress notes
- ✅ `pom.xml` - Multi-module Maven parent configuration

### **Frontend Module (`frontend/`)**
- ✅ `package.json` - React 18.2.0, TypeScript 5.3.3, Tailwind CSS 3.4.0
- ✅ `tsconfig.json` - Strict TypeScript configuration
- ✅ `webpack.config.js` - Production build with React bundling
- ✅ `tailwind.config.js` - Custom Confluence color scheme
- ✅ `postcss.config.js` - Tailwind CSS processing
- ✅ `pom.xml` - Frontend Maven module with Node.js integration

### **Frontend Source (`frontend/src/`)**
- ✅ `components/toolbar.tsx` - React toolbar component with all features
- ✅ `index.tsx` - Main entry point with selection detection
- ✅ `styles/main.css` - Tailwind CSS imports and custom styles
- ✅ `i18n/inline-toolbar.properties` - Internationalization strings

### **Plugin Module (`inlineeditor/`)**
- ✅ `pom.xml` - Confluence plugin Maven configuration
- ✅ `src/main/resources/atlassian-plugin.xml` - Plugin descriptor
- ✅ `src/main/resources/js/inlineeditor.js` - Plugin initialization
- ✅ `src/main/resources/js/inline-toolbar.js` - Built React app (141 KiB)
- ✅ `src/main/resources/css/inline-toolbar.css` - Built CSS (14.9 KiB)
- ✅ `src/main/resources/images/` - Plugin icons
- ✅ `src/main/resources/META-INF/spring/plugin-context.xml` - Spring config

### **Build Artifacts (Generated)**
- ✅ `frontend/node_modules/` - Node.js dependencies (ignored)
- ✅ `frontend/dist/` - Webpack build output (ignored)
- ✅ `frontend/node/` - Node.js installation (ignored)
- ✅ `inlineeditor/target/` - Maven build output (ignored)
- ✅ `inlineeditor/src/main/resources/js/inline-toolbar.js*` - Built files (ignored)
- ✅ `inlineeditor/src/main/resources/css/inline-toolbar.css*` - Built files (ignored)

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

## File Size Expectations

- **React Bundle**: ~141 KiB (includes React 18.2.0)
- **CSS Bundle**: ~14.9 KiB (Tailwind CSS)
- **Plugin JAR**: ~200 KiB total
- **Node Modules**: ~287 packages (ignored by git)

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

### Common Issues
- **Empty JavaScript files**: Ensure `inlineeditor.js` has initialization code
- **Missing build artifacts**: Run `atlas-mvn clean package`
- **Node.js version conflicts**: Use Node.js 16.14.0 as specified in pom.xml

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