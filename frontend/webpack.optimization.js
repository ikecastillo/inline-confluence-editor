/**
 * Webpack optimization configuration for bundle size reduction
 */

const path = require('path');

/**
 * Get optimization configuration based on environment
 */
function getOptimizationConfig(isProduction) {
  const config = {
    minimize: isProduction,
    sideEffects: false,
    usedExports: true,
    
    // Disable split chunks for single bundle output
    splitChunks: false,
    
    // Tree shaking and dead code elimination
    providedExports: true,
    usedExports: true,
    concatenateModules: true,
    
    // Mangling and compression settings
    mangleExports: isProduction,
    
    // Module optimization
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  };
  
  if (isProduction) {
    // Production-specific optimizations
    config.minimizer = [];
    
    // Try to add Terser plugin if available
    try {
      const TerserPlugin = require('terser-webpack-plugin');
      config.minimizer.push(new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.debug', 'console.info']
          },
          mangle: {
            safari10: true
          },
          output: {
            comments: false,
            ascii_only: true
          }
        },
        extractComments: false
      }));
    } catch (e) {
      console.warn('Terser plugin not available, using default minification');
    }
    
    // Try to add CSS minimization if available
    try {
      const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
      config.minimizer.push(new CssMinimizerPlugin());
    } catch (e) {
      console.warn('CSS minimizer plugin not available, using default CSS minification');
    }
  }
  
  return config;
}

/**
 * Get external dependencies configuration
 * Note: Only use externals if the host environment (Confluence) provides them
 */
function getExternalsConfig() {
  // Currently, Confluence doesn't provide React, so we bundle it
  // In the future, if Confluence provides React, we can externalize it:
  // return {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // };
  
  return {};
}

/**
 * Get resolve configuration for module resolution
 */
function getResolveConfig() {
  return {
    alias: {
      // Alias for smaller lodash-like utilities
      'lodash': 'lodash-es',
      
      // Ensure single React instance
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    },
    
    // Prefer ES modules for better tree shaking
    mainFields: ['browser', 'module', 'main'],
    
    // Extensions to resolve
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
  };
}

/**
 * Get performance hints configuration
 */
function getPerformanceConfig(isProduction) {
  if (!isProduction) {
    return { hints: false };
  }
  
  return {
    hints: 'warning',
    maxAssetSize: 100000, // 100KB
    maxEntrypointSize: 100000, // 100KB
    assetFilter: function(assetFilename) {
      // Only check JS and CSS files
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    }
  };
}

/**
 * Get bundle analysis configuration
 */
function getBundleAnalysisConfig(isProduction) {
  if (!isProduction || !process.env.ANALYZE_BUNDLE) {
    return [];
  }
  
  try {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    return [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    ];
  } catch (e) {
    console.warn('Bundle analyzer not available');
    return [];
  }
}

module.exports = {
  getOptimizationConfig,
  getExternalsConfig,
  getResolveConfig,
  getPerformanceConfig,
  getBundleAnalysisConfig
};