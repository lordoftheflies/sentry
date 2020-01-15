/*eslint-env node*/
/*eslint import/no-nodejs-modules:0 */
const path = require('path');
const webpack = require('webpack');
const appConfig = require('../webpack.config');

const staticPath = path.resolve(
  __dirname,
  '..',
  'src',
  'sentry',
  'static',
  'sentry',
  'app'
);

module.exports = {
  stories: ['../docs-ui/components/*.stories.*'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {configureJSX: true},
    },
    // {
    // name: '@storybook/source-loader',
    // options: {
    // rule: {
    // // test: [/\.stories\.jsx?$/], This is default
    // include: [path.resolve(__dirname, '../docs-ui')], // You can specify directories
    // },
    // loaderOptions: {
    // prettierConfig: {printWidth: 80, singleQuote: false},
    // },
    // },
    // },
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-a11y',
    '@storybook/addon-options',
  ],
  webpack: config => {
    console.log(JSON.stringify(config.module.rules));
    const newConfig = {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          // {
          // test: /\.stories\.tsx?$/,
          // loaders: [
          // {
          // loader: require.resolve('@storybook/source-loader'),
          // options: {parser: 'typescript'},
          // },
          // ],
          // enforce: 'pre',
          // },
          // {
          // test: /\.tsx?$/,
          // loader: 'ts-loader',
          // },
          // {
          // test: /\.[tj]sx?$/,
          // include: [path.join(__dirname, '../src/sentry/static')],
          // exclude: /(vendor|node_modules|dist)/,
          // use: {
          // loader: 'babel-loader',
          // },
          // },
          // {
          // test: /\.(stories|story)\.[tj]sx?$/,
          // loaders: [
          // {
          // loader: require.resolve('@storybook/source-loader'),
          // options: {parser: 'typescript'},
          // },
          // ],
          // enforce: 'pre',
          // },
          {
            test: /\.po$/,
            loader: 'po-catalog-loader',
            query: {
              referenceExtensions: ['.js', '.jsx'],
              domain: 'sentry',
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /app\/icons\/.*\.svg$/,
            use: [
              {
                loader: 'svg-sprite-loader',
              },
              {
                loader: 'svgo-loader',
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
              },
            ],
          },
          {
            test: /\.(woff|woff2|ttf|eot|svg|png|gif|ico|jpg)($|\?)/,
            exclude: /app\/icons\/.*\.svg$/,
            loader: 'file-loader?name=' + '[name].[ext]',
          },
        ],
      },

      plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          'root.jQuery': 'jquery',
          underscore: 'underscore',
          _: 'underscore',
        }),
        new webpack.DefinePlugin({
          'process.env': {
            IS_PERCY: true,
          },
        }),
      ],

      resolve: {
        ...config.resolve,
        extensions: appConfig.resolve.extensions,
        alias: Object.assign({}, appConfig.resolve.alias, {
          app: staticPath,
        }),
      },
    };

    console.log(newConfig);
    return newConfig;
  },
};
