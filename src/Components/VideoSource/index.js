import React, { PropTypes } from 'react'
import classname from 'classname'

const VideoSource = props => {
  const dropDownVideo = {
    'marker-content': true,
    'invisible': props.show
  }
  return (
    <div className='marker-dropdown wide'> 
      <div className='marker-header' onClick={props.dropdownVideo}> 
        {props.activeDevice ? props.activeDevice: 'No devices found'}
        <img role='presentation' src={require("../../Assets/down_arrow.svg")}/>
      </div>
      <div className={dropDownVideo}> 
        {props.devices.map((device, index) => {
          return (
            <p key={index} onClick={() => props.updateDevice(index)}> {device.label} </p>
          )
        })}
      </div>
    </div>
  )
}

VideoSource.propTypes = {
  show: PropTypes.bool,
  activeDevice: PropTypes.string,
  devices: PropTypes.array

}
export default VideoSource