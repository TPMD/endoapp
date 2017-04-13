import React, { PropTypes } from 'react'
import classname from 'classname'

const ImageCapture = props => {
  const SelectAll = classname({
      'button': true,
      'grey': props.showSelectedImageCount === true,
      'invisible': props.showSelectAll === false
    })
  const DeselectAll = classname({
      'button': true,
      'invisible': props.showDeselectAll === false
    })
  const RemoveAll = classname({
      'button': true,
      'light': true,
      'invisible-pe': props.showSelectedImageCount === false
    })
  return (
    <div className='column'> 
      <div className='card image-capture'> 
        <div className='card-header no-margin'> 
          <h3 className='title'> Image Capture </h3>
          <div className='button-wrap'> 
            <p className='image-index'> 
              <span className={!props.showSelectedImageCount ? 'invisible': ''}> {props.selectedImageCount}
              </span> 
              <span> Images <span className={!props.showSelectedImageCount ? 'invisible': ''}> Selected </span></span>
            </p>
             <a className={SelectAll}>Select All</a>
             <a className={DeselectAll}>Deselect</a>
             <a className={RemoveAll}>Remove</a>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  )
}

ImageCapture.propTypes = {
  showSelectedImageCount: PropTypes.bool,
  selectedImageCount: PropTypes.number
}

export default ImageCapture