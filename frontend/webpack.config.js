const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { getBuildConfig, ensureDirectories } = require('./build-utils');
const { 
  getOptimizationConfig, 
  getExternalsConfig, 
  getResolveConfig, 
  getPerformanceConfig, 
  getBundleAnalysisConfig 
} = require('./webpack.optimization');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Get build configuration with path resolution
  const buildConfig = getBuildConfig();
  ensureDirectories(buildConfig);
  
  console.log(`Building to: ${buildConfig.outputPath}`);
  
  return {
    entry: './src/index.tsx',
    output: {
      path: buildConfig.outputPath,
      filename: 'js/inline-toolbar.js',
      library: {
        name: 'InlineToolbar',
        type: 'var'
      },
      clean: {
        keep: /\.(properties|png|jpg|jpeg|gif|svg)$/i, // Keep non-JS/CSS assets
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    resolve: getResolveConfig(),
    externals: getExternalsConfig(),
    optimization: getOptimizationConfig(isProduction),
    performance: getPerformanceConfig(isProduction),
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['js/*', 'css/*']
      }),
      new MiniCssExtractPlugin({
        filename: 'css/inline-toolbar.css'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/i18n',
            to: 'i18n',
            noErrorOnMissing: true
          }
        ]
      }),
      ...getBundleAnalysisConfig(isProduction)
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map'
    // Bundle React since Confluence doesn't provide it
  };
}; 