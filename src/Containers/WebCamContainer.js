import React, { Component } from 'react'
//import Webcam from 'react-user-media'

class WebCamContainer extends Component {
  constructor() {
    super()
    this.state = {
      record: false
    }
  }
  render() {
    return (
      <div className='two-columns even'> 
        <div className='columns'> 
          <div className='card priority'> 
            <div classNAme='flex-end'> 
               <img src={require('../Assets/stillimage.png')} role='presentation' className="still-image" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WebCamContainer