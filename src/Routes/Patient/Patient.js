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
      'createdAt': '',
      'patientId': ''
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
        localStorage.setItem("patientName", this.state.name);
        localStorage.setItem("patientDoctor", this.state.doctor);
        localStorage.setItem("patientHospital", this.state.hospital);
        localStorage.setItem("patientInsurance", this.state.insurance);
        localStorage.setItem("patientCreatedAt", this.state.createdAt);
        localStorage.setItem('patientOperationType', this.state.operationType)
        localStorage.setItem('patientId', this.state.patientId)
        browserHistory.push('/imagecapture');
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
          <input type="text" value={this.state.patientId} onChange={this.updateInput.bind(this, 'patientId')}/>
          <p className="label">Hospital</p>
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
