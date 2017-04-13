import React, { PropTypes } from 'react'
import classname from 'classname'

const PictureCanvas = props => {
  return (
    <div className='canvases'> 
      {props.images.map((image, index) => {
        let canvasIndex = 'canvas-index' + index;
        let canvasClass = classname({
          'highlighted': image.selected === true,
          'canvas-padding':true
        })
        canvasClass += " " + canvasIndex;
        return (
          <div className={canvasClass}>
            <p> 2 seconds</p>
            <canvas> </canvas>
          </div>
        )
      })}
    </div>
  )
}

PictureCanvas.propTypes = {
  images: PropTypes.array,

}

export default PictureCanvas