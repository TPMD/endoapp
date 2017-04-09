import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import superagent from 'superagent';

import './Register.scss';

import { API } from '../../env';

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'email': '',
      'password': '',
      'password_confirm': '',
      'userType': 'doctor'
    }
  }

  updateInput(key, e) {
    var state = this.state;
    state[key] = e.target.value;
    this.setState(state);
  }


  register() {
    if(this.state.password !== this.state.password_confirm) {
      alert('your password does not match')
      return
    }
    superagent
    .post(API + '/user/signup')
    .send(this.state)
    .end((err, res) => {
      if (err) {
        alert(res.text);
      } else {
        alert("Successfully registered. You may now login.");
        browserHistory.push('/');
      }
    });
  }

  render() {
    return (
      <div className="login">
        <div className="login-wrap">
          <h1>Endopage 365</h1>
          <p className="label">Email</p>
          <input type="text" value={this.state.User_Email} onChange={this.updateInput.bind(this, 'email')}/>
          <p className="label">Password</p>
          <input type="password" value={this.state.password} onChange={this.updateInput.bind(this, 'password')}/>
          <p className="label">Confirm Password</p>
          <input type="password" value={this.state.password_confirm} onChange={this.updateInput.bind(this, 'password_confirm')}/>
          <div className="btn-wrap">
            <a className="btn" onClick={this.register.bind(this)}>Register</a>
          </div>
          <a href="/">Already registered? Login here.</a>
        </div>
      </div>
    );
  }

}

export default Register;
