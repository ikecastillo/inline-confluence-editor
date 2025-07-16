# Project Structure Expectations

## What You Should Expect When Cloning This Repository

### 📁 Root Directory Structure
```
inline-confluence-editor/
├── .gitignore                    # ✅ Git ignore rules
├── README.md                     # ✅ Complete documentation
├── planning.md                   # ✅ Project tracking
├── pom.xml                       # ✅ Multi-module Maven parent
├── frontend/                     # ✅ React/TypeScript module
├── inlineeditor/                 # ✅ Confluence plugin module
└── target/                       # ❌ Build output (ignored)
```

### 📦 Frontend Module (`frontend/`)
```
frontend/
├── package.json                  # ✅ React 18.2.0, TypeScript 5.3.3
├── tsconfig.json                 # ✅ Strict TypeScript config
├── webpack.config.js             # ✅ Production build setup
├── tailwind.config.js            # ✅ Custom Confluence theme
├── postcss.config.js             # ✅ Tailwind CSS processing
├── pom.xml                       # ✅ Frontend Maven module
├── src/                          # ✅ Source code
│   ├── components/
│   │   └── toolbar.tsx          # ✅ React toolbar component
│   ├── styles/
│   │   └── main.css             # ✅ Tailwind CSS imports
│   ├── i18n/
│   │   └── inline-toolbar.properties
│   └── index.tsx                # ✅ Entry point
├── node_modules/                 # ❌ Dependencies (ignored)
├── dist/                         # ❌ Build output (ignored)
└── node/                         # ❌ Node.js install (ignored)
```

### 🔌 Plugin Module (`inlineeditor/`)
```
inlineeditor/
├── pom.xml                       # ✅ Plugin Maven config
└── src/main/resources/
    ├── atlassian-plugin.xml      # ✅ Plugin descriptor
    ├── inlineeditor.properties   # ✅ Plugin properties
    ├── js/
    │   ├── inlineeditor.js       # ✅ Plugin initialization
    │   └── inline-toolbar.js     # ✅ Built React app (141 KiB)
    ├── css/
    │   ├── inlineeditor.css      # ✅ Plugin CSS (empty)
    │   └── inline-toolbar.css    # ✅ Built CSS (14.9 KiB)
    ├── images/
    │   ├── pluginIcon.png        # ✅ Plugin icon
    │   └── pluginLogo.png        # ✅ Plugin logo
    ├── i18n/
    │   └── inline-toolbar.properties
    └── META-INF/spring/
        └── plugin-context.xml    # ✅ Spring configuration
```

## File Size Expectations

| File/Directory | Size | Status |
|----------------|------|--------|
| React Bundle | ~141 KiB | ✅ Built |
| CSS Bundle | ~14.9 KiB | ✅ Built |
| Plugin JAR | ~200 KiB | ✅ Generated |
| Node Modules | ~287 packages | ❌ Ignored |
| Build Artifacts | Various | ❌ Ignored |

## Key Configuration Files

### Maven Configuration
- **Root `pom.xml`**: Multi-module parent with Confluence 8.5.4
- **Frontend `pom.xml`**: Node.js integration with frontend-maven-plugin
- **Plugin `pom.xml`**: Confluence plugin with Spring scanner

### Frontend Configuration
- **`package.json`**: React 18.2.0, TypeScript 5.3.3, Tailwind 3.4.0
- **`webpack.config.js`**: Production build with React bundling
- **`tsconfig.json`**: Strict TypeScript with React JSX
- **`tailwind.config.js`**: Custom Confluence color scheme

### Plugin Configuration
- **`atlassian-plugin.xml`**: Web resources, contexts, dependencies
- **`plugin-context.xml`**: Spring scanner configuration
- **`inlineeditor.js`**: AJS initialization for edit mode

## Build Process

1. **Frontend Build**: `npm run build` → `frontend/src/main/resources/`
2. **Copy Resources**: Frontend artifacts copied to `inlineeditor/src/main/resources/`
3. **Maven Build**: `atlas-mvn package` → `inlineeditor/target/inlineeditor-1.0.0-SNAPSHOT.jar`

## What Gets Ignored by Git

- ✅ `node_modules/` - Node.js dependencies
- ✅ `target/` - Maven build output
- ✅ `frontend/dist/` - Webpack build output
- ✅ `frontend/node/` - Node.js installation
- ✅ Built JavaScript and CSS files
- ✅ IDE files (`.idea/`, `.vscode/`)
- ✅ OS files (`.DS_Store`, `Thumbs.db`)

## What Gets Tracked by Git

- ✅ All source code (TypeScript, React components)
- ✅ Configuration files (Maven, Node.js, Webpack)
- ✅ Documentation (README, planning)
- ✅ Plugin descriptors and properties
- ✅ Internationalization files

## Development Workflow

1. **Clone Repository**: Get the complete project structure
2. **Install Dependencies**: `cd frontend && npm install`
3. **Build Project**: `atlas-mvn clean package`
4. **Run Development**: `atlas-run`
5. **Test Plugin**: Select text in Confluence editor

## Troubleshooting Checklist

- [ ] Node.js version is 16.14.0+
- [ ] Java version is 11+
- [ ] Atlassian SDK is installed
- [ ] All dependencies are installed
- [ ] Build artifacts are generated
- [ ] Plugin JAR is created
- [ ] Plugin is enabled in Confluence
- [ ] Browser console shows no errors
- [ ] Text selection works in editor
- [ ] Toolbar appears below selection 