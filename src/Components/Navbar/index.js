import React from 'react';

import '../../scss/Theme.scss';

export const Navbar = props => {
  return (
    <div className='navbar'> 
      <h1> {props.heading} </h1>
      <div className='right-menu'> 
        {props.navbarItems.map((item, index) => {
          return (
            <a className={item.className} key={index} onClick={() => props.onClick(item, index)}>{item.text}</a>
          )
        })}
        {props.children}
      </div>
    </div>
  )
}

export default Navbar;
