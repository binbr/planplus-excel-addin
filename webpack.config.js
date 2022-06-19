const webpack = require('webpack')
const path = require('path')
const devCerts = require('office-addin-dev-certs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const urlDev = 'https://localhost:3000/'
const urlProd = 'https://t.perfei.com/planplus-excel-addin/'

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions()
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert }
}

module.exports = async (env, options) => {
  const dev = options.mode === 'development'
  const config = {
    entry: {
      taskpane: './src/taskpane/index.tsx',
      commands: './src/commands/index.ts'
    },
    output: {
      clean: true,
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash:10].js'
    },
    module: {
      rules: [
        { //assets
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext][query]',
          },
        }, { // js
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }, { // ts
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }, { // less
          test: /\.less$/,
          exclude: /\.module\.less$/,
          use: [
            dev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  sourceMap: true,
                  javascriptEnabled: true
                }
              },
            }
          ]
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({ // assets
        patterns: [
          {
            from: 'src/assets/*',
            to: 'assets/[name][ext][query]',
          },
          {
            from: 'manifest*.xml',
            to: 'assets/[name]' + '[ext]',
            transform(content) {
              if (dev) {
                return content
              } else {
                return content.toString().replace(new RegExp(urlDev, 'g'), urlProd)
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({ // taskpane.html
        filename: 'taskpane.html',
        chunks: ['taskpane', 'vendors'],
        title: 'Excel Add-in Taskpane',
        template: './src/template.html',
        appNode: '<div id=\"app\"></div>'
      }),
      new HtmlWebpackPlugin({ // commands.html
        filename: 'commands.html',
        chunks: ['commands', 'vendors'],
        title: 'Excel Add-in Commands',
        template: './src/template.html'
      }),
      new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/),
      new MiniCssExtractPlugin({ // .css
        filename: 'css/styles.[contenthash:10].css'
      })
    ],
    devServer: dev ? {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      server: {
        type: 'https',
        options: options.https !== undefined ? options.https : await getHttpsOptions()
      },
      host: '127.0.0.1',
      port: process.env.npm_package_config_dev_server_port || 3000,
      open: ['/taskpane.html']
    } : {},
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
      runtimeChunk: 'single',
      minimizer: [
        `...`,
        new CssMinimizerPlugin({ // css
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          }
        })
      ]
    }
  }
  return config
}
