import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import { Router, Route, browserHistory } from 'react-router';

import Home from './Routes/Home/Home';
import Login from './Routes/Login/Login';
import Register from './Routes/Register/Register';
import Patient from './Routes/Patient/Patient';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Login}/>
    <Route path="/register" component={Register}/>
    <Route path="/patient" component={Patient}/>
    <Route path="/endopage" component={Home}/>
  </Router>,
  document.getElementById('root')
);
