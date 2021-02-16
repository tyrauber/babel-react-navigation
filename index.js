import Koa from 'koa';

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native';
import { View } from "react-native";

import App from './App'; // Works
//import App from './AppNav'; // Fails
AppRegistry.registerComponent('App', () => App);

const app = new Koa();


app.use(async (ctx) => {
  const location = new URL(ctx.url, 'http://localhost:3000/');
  const { element, getStyleElement } = AppRegistry.getApplication('App');

  const html = ReactDOMServer.renderToString(
    <View location={location}>{element}</View>
  );
  const document = `<!DOCTYPE html><html style="height:100%"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style></style></head><body style="height:100%; overflow-y:hidden"><div id="root"></div></body></html>`
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());
  const resp = document
    .replace(`<div id="root"></div>`, html)
    .replace(/<style>(.*)<\/style>/, `<style>$1</style>${css}`)
  ctx.body = resp;
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

exports.app = app;