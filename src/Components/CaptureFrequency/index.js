import React, { PropTypes } from 'react'

const CaptureFrequency = props => {
  return (
    <div className='marker-dropdown'> 
      <div className="marker-header" onClick={props.dropdownTime}>
        <p>
        {(Math.floor((props.setTime) / 60) * 1)}
        :
        {("0" + (Math.floor((props.setTime) / 30) * 30) % 60).slice(-2)}</p>
        <img src={require("../../Assets/down_arrow.svg")} role='presentation'/>
      </div>
    </div>
  )
}

CaptureFrequency.propTypes = {
  setTime: PropTypes.number,
  dropdownTime: PropTypes.func
}

export default CaptureFrequency