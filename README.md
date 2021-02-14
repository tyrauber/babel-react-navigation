# babel-react-navigation

ReactNavigation is awesome. V5 and the web capabilities are amazing. Being able to build a react-native / react-navigation for both web and mobile, with server side rendering, would be like the holy grail of web development, in my humble opinion.

Unfortunately, the build process for react-navigation is difficult. Both babel and webpack are required to compile and use react-navigation.  react-navigation cannot be used as es6 with babel alone.

This application attempts to demonstrate this issue.

### Usage

`$ git clone git://github.com/tyrauber/babel-react-navigation`

`$ yarn dev` // fails with import error

`$ yarn build && yarn start` // works after compiling to commonjs

### babel.config

Using the [babel-preset-expo](https://www.npmjs.com/package/babel-preset-expo) preset.

```
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [[
      'module-resolver',{
        alias: {
          'react-native$': 'react-native-web',
          'hammerjs': '@egjs/hammerjs'
        },
      }
    ]]
  }
};
```

To build for the web, using babel-module-resolver to alias react-native to react-native-web and hammerjs to @egjs/hammerjs.

### Webpack

```
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
```

### About

There is absolutely no problem importing `react`, `react-native`, `react-native-web` or `react-dom` in a project written in either commonjs or es6 modules. But add react-navigation to the project and it blows up with the following error:

```
node_modules/react-native/index.js:13
import typeof AccessibilityInfo from './Libraries/Components/AccessibilityInfo/AccessibilityInfo';
...
node_modules/@react-navigation/native/lib/commonjs/useBackButton.tsx:2:1)
```

I have only been able to resolve this error by creating a webpack build process that transpiles react-navigation to commonjs.

Unfortunately, in development mode, this means transpiling a webpack build process for every single code change.

Optimally, we'd be able to develop and test ES6 modules, and transpile to commonjs only for production, if required.  Running babel with nodemon should be enough to run the app locally.

If anyone has a better solution, I'd love to hear it. Create an Issue or better yet, open a Pull request. Thanks!
