/**
 * Build utilities for handling paths and environment configuration
 */

const path = require('path');
const fs = require('fs');

/**
 * Resolve output path for built assets with fallback mechanisms
 */
function resolveOutputPath() {
  // Default plugin resource directory
  const defaultPath = path.resolve(__dirname, '../inlineeditor/src/main/resources');
  
  // Alternative paths to try
  const alternativePaths = [
    path.resolve(__dirname, '../inlineeditor/src/main/resources'),
    path.resolve(__dirname, '../../inlineeditor/src/main/resources'),
    path.resolve(__dirname, '../backend/src/main/resources'),
    path.resolve(__dirname, 'dist') // fallback to local dist
  ];
  
  // Environment variable override
  if (process.env.PLUGIN_RESOURCES_PATH) {
    const envPath = path.resolve(process.env.PLUGIN_RESOURCES_PATH);
    if (fs.existsSync(envPath)) {
      console.log(`Using environment path: ${envPath}`);
      return envPath;
    } else {
      console.warn(`Environment path does not exist: ${envPath}`);
    }
  }
  
  // Try each path in order
  for (const testPath of alternativePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`Using output path: ${testPath}`);
      return testPath;
    }
  }
  
  // If no paths exist, create the default one
  console.warn(`No existing output path found. Creating: ${defaultPath}`);
  try {
    fs.mkdirSync(defaultPath, { recursive: true });
    return defaultPath;
  } catch (error) {
    console.error(`Failed to create output directory: ${error.message}`);
    // Final fallback to dist directory
    const distPath = path.resolve(__dirname, 'dist');
    fs.mkdirSync(distPath, { recursive: true });
    return distPath;
  }
}

/**
 * Validate that the output path is writable
 */
function validateOutputPath(outputPath) {
  try {
    // Test write permissions
    const testFile = path.join(outputPath, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return true;
  } catch (error) {
    console.error(`Output path is not writable: ${outputPath}`, error.message);
    return false;
  }
}

/**
 * Get build configuration based on environment
 */
function getBuildConfig() {
  const outputPath = resolveOutputPath();
  
  if (!validateOutputPath(outputPath)) {
    throw new Error(`Build output path is not accessible: ${outputPath}`);
  }
  
  return {
    outputPath,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    projectRoot: path.resolve(__dirname, '..'),
    assetsPath: {
      js: path.join(outputPath, 'js'),
      css: path.join(outputPath, 'css'),
      i18n: path.join(outputPath, 'i18n')
    }
  };
}

/**
 * Ensure required directories exist
 */
function ensureDirectories(config) {
  const directories = [
    config.assetsPath.js,
    config.assetsPath.css,
    config.assetsPath.i18n
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

module.exports = {
  resolveOutputPath,
  validateOutputPath,
  getBuildConfig,
  ensureDirectories
};