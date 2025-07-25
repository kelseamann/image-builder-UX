/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Dotenv from 'dotenv-webpack';
const BG_IMAGES_DIRNAME = 'bgimages';
const ASSET_PATH = process.env.ASSET_PATH || (process.env.NODE_ENV === 'production' ? '' : '/');

export default (env) => {
  return {
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx)?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.(svg|ttf|eot|woff|woff2)$/,
          type: 'asset/resource',
          // only process modules with this loader
          // if they live under a 'fonts' or 'pficon' directory
          include: [
            path.resolve('./node_modules/patternfly/dist/fonts'),
            path.resolve('./node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
            path.resolve('./node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
            path.resolve('./node_modules/@patternfly/patternfly/assets/fonts'),
            path.resolve('./node_modules/@patternfly/patternfly/assets/pficon'),
          ],
        },
        {
          test: /\.svg$/,
          type: 'asset/inline',
          include: (input) => input.indexOf('background-filter.svg') > 1,
          use: [
            {
              options: {
                limit: 5000,
                outputPath: 'svgs',
                name: '[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader if they live under a 'bgimages' directory
          // this is primarily useful when applying a CSS background using an SVG
          include: (input) => input.indexOf(BG_IMAGES_DIRNAME) > -1,
          type: 'asset/inline',
        },
        {
          test: /\.svg$/,
          // only process SVG modules with this loader when they don't live under a 'bgimages',
          // 'fonts', or 'pficon' directory, those are handled with other loaders
          include: (input) =>
            input.indexOf(BG_IMAGES_DIRNAME) === -1 &&
            input.indexOf('fonts') === -1 &&
            input.indexOf('background-filter') === -1 &&
            input.indexOf('pficon') === -1,
          use: {
            loader: 'raw-loader',
            options: {},
          },
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/i,
          include: [
            path.resolve('./src'),
            path.resolve('./node_modules/patternfly'),
            path.resolve('./node_modules/@patternfly/patternfly/assets/images'),
            path.resolve('./node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve('./node_modules/@patternfly/react-core/dist/styles/assets/images'),
            path.resolve('./node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve('./node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'),
            path.resolve('./node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css/assets/images')
          ],
          type: 'asset/inline',
          use: [
            {
              options: {
                limit: 5000,
                outputPath: 'images',
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve('./dist'),
      publicPath: ASSET_PATH,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./src', 'index.html'),
      }),
      new Dotenv({
        systemvars: true,
        silent: true,
      }),
      new CopyPlugin({
        patterns: [{ from: './src/favicon.png', to: 'images' }],
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve('./tsconfig.json'),
        }),
      ],
      symlinks: false,
      cacheWithContext: false,
    },
  };
};
