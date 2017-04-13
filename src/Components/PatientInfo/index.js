import React, { PropTypes } from 'react'
import moment from 'moment'

const PatientInfo = props => {
  return (
    <div className="column">
      <div className="card border margin-top">
        <h3 className="padding">{props.patient.Name}</h3>
        <h3 className="">{props.patient.hospitalId}</h3>
        <div className="line"></div>
        <h3 className="padding">{props.patient.operationType}</h3>
        <div className="line"></div>
        <h3 className="padding">{moment.utc(Number(props.patient.patientDate)).format('YYYY-MM-DD')}</h3>
        <div className="line"></div>
        <h3 className="padding">{props.patient.doctor}</h3>
        <div className="line"></div>
        <h3 className="padding">{props.patient.insurance}</h3>
      </div>
    </div>
  )
}

PatientInfo.propTypes = {
  patient: PropTypes.object
}

export default PatientInfo

