import { Router, Route, hashHistory, IndexRoute, IndexRedirect } from 'react-router';
import React, { Component } from 'react';
import App from './components/app'

export default (
  <Router history={ hashHistory }>
    <Route path='/' component={ App }> 
    </Route>
  </Router>
);