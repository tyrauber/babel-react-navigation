const nodeExternals = require("webpack-node-externals");
const path = require('path');
module.exports = {
    entry: {
      index: path.resolve(__dirname, './index')
    },
    target: "node",
    devtool: 'source-map',
    node: {
      __dirname: false
    },
    externals: [nodeExternals({
      allowlist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,

        // Allow transpilation of react-native for SSR
        /@?react-(navigation|native)/,
        /hammerjs/ // ... because mapping it to @egjs/hammerjs
      ]
    })],
    mode:  "production",
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },

    optimization: {
      minimize: false
    },
    performance: {
      hints: false
    },
    module: {
      rules: [    
        // Process react-native modules because node needs commonjs
        {
          test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
          exclude: [
            /react-native-web/,
            /\.(native|ios|android)\.(ts|js)x?$/
          ],
          loader: 'babel-loader',
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: [
            /node_modules/,
            /\.(native|ios|android)\.(ts|js)x?$/
          ],
          loader: 'babel-loader',
        }
      ]
    }
};