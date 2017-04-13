import React from 'react'

const PopUp = props => {
  return (
    <div className={`popup ${props.show ? 'visible': ''}`}> 
      <div className='popup-wrap'>
        <p> {props.message}</p>
         {props.children}
        <a className='btn white' onClick={() => props.handlePopUpAction('dismiss')}> dismiss </a>
      </div>
    </div>
  )
}

export default PopUp