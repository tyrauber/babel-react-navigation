import Koa from 'koa';

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native';

import { ServerContainer, ServerContainerRef } from '@react-navigation/native';
/* Just importing @react-navigation/native results in the error:
import typeof AccessibilityInfo from './Libraries/Components/AccessibilityInfo/AccessibilityInfo';
*/

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hello World"
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

exports.app = app;