import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import superagent from 'superagent';

import './Login.scss';

import { API } from '../../env';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'email': '',
      'password': ''
    }
  }

  updateInput(key, e) {
    var state = this.state;
    state[key] = e.target.value;
    this.setState(state);
  }

  login() {
    superagent
    .post(API + '/user/login')
    .send(this.state)
    .end((err, res) => {
      console.log(res)
      if (err) {
        alert(res.text);
      } else {
        browserHistory.push('/patient');
      }
    });
  }


  render() {
    return (
      <div className="login">
        <div className="login-wrap">
          <h1>Endopage</h1>
          <p className="label">Email</p>
          <input type="text" value={this.state.email} onChange={this.updateInput.bind(this, 'email')}/>
          <p className="label">Password</p>
          <input type="password" value={this.state.password} onChange={this.updateInput.bind(this, 'password')}/>
          <div className="btn-wrap">
            <a className="btn" onClick={this.login.bind(this)}>Login</a>
          </div>
          <a href="/register">Not registered? Register here.</a>
        </div>
      </div>
    );
  }

}

export default Login;
