import 'babel-polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import routes from './router'


let root = document.getElementById('app');

render(
  routes,
  root
);