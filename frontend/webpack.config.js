const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, '../inlineeditor/src/main/resources'),
      filename: 'js/inline-toolbar.js',
      library: {
        name: 'InlineToolbar',
        type: 'var'
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
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
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
      })
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map'
    // Bundle React since Confluence doesn't provide it
  };
}; 