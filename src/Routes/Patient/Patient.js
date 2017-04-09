import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import superagent from 'superagent';

import './Patient.scss';

import { API } from '../../env';

class Patient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'doctor': '',
      'name': '',
      'hospital': '',
      'insurance': '',
      'operationType': '',
      'createdAt': ''
    }
  }

  updateInput(key, e) {
    var state = this.state;
    state[key] = e.target.value;
    this.setState(state);
  }

  addPatient() {

    var payload = this.state;
    payload['createdAt'] = Number(new Date(payload['createdAt']));

    superagent
    .post(API + '/patient')
    .send(payload)
    .end((err, res) => {
      if (err) {
        alert(res.text);
      } else {
        console.log(res.text);
        localStorage.setItem("Patient_Id", res.text);
        browserHistory.push('/endopage');
      }
    });
  }

  render() {
    return (
      <div className="login">
        <div className="login-wrap">
          <h1>Register a new patient</h1>
          <p className="label">Doctor</p>
          <input type="text" value={this.state.doctor} onChange={this.updateInput.bind(this, 'doctor')}/>
          <p className="label">Patient Name</p>
          <input type="text" value={this.state.name} onChange={this.updateInput.bind(this, 'name')}/>
          <p className="label">Patient Id</p>
          <input type="text" value={this.state.hospital} onChange={this.updateInput.bind(this, 'hospital')}/>
          <p className="label">Patient Insurance</p>
          <input type="text" value={this.state.insurance} onChange={this.updateInput.bind(this, 'insurance')}/>
          <p className="label">Operation Type</p>
          <input type="text" value={this.state.operationType} onChange={this.updateInput.bind(this, 'operationType')}/>
          <p className="label">Date</p>
          <input type="date" value={this.state.createdAt} onChange={this.updateInput.bind(this, 'createdAt')}/>

          <div className="btn-wrap">
            <a className="btn" onClick={this.addPatient.bind(this)}>Add Patient</a>
          </div>
        </div>
      </div>
    );
  }

}

export default Patient;
