const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = require('progress-webpack-plugin');

const { dependencies, devDependencies, version } = require('./package.json');

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies));
const isDevMode = process.env.NODE_ENV === 'development';
const whiteListedModules = [];

module.exports = { // Main
   name: 'main',
   mode: process.env.NODE_ENV,
   devtool: isDevMode ? 'eval-source-map' : false,
   entry: {
      main: path.join(__dirname, './src/main/main.ts')
   },
   target: 'electron-main',
   output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, 'dist'),
      filename: '[name].js'
   },
   node: {
      global: true,
      __dirname: isDevMode,
      __filename: isDevMode
   },
   externals: externals.filter((d) => !whiteListedModules.includes(d)),
   resolve: {
      extensions: ['.js', '.json', '.ts'],
      alias: {
         src: path.join(__dirname, 'src/')
      },
      fallback: {
         'pg-native': false,
         'cpu-features': false,
         cardinal: false
      }
   },
   plugins: [
      new ProgressPlugin(true),
      new webpack.DefinePlugin({
         'process.env': {
            PACKAGE_VERSION: `"${version}"`
         }
      })
   ],
   module: {
      rules: [
         {
            test: /\.node$/,
            loader: 'node-loader',
            options: {
               name: '[path][name].[ext]'
            }
         },
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
         },
         {
            test: /\.(png|jpg|gif)$/,
            use: [{
               loader: 'file-loader'
            }]
         }
      ]
   }
};
