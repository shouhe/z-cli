import { Router, Route, hashHistory, IndexRoute, IndexRedirect } from 'react-router';
import React, { Component } from 'react';
import App from './components/app';
import Items from './components/items';

export default (
  <Router history={ hashHistory }>
    <Route path='/' component={ App }/>
    <Route path='/item' component={ Items }/>
  </Router>
);