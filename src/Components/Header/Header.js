import React, { Component } from 'react';

import '../../Theme.scss';

class Header extends Component {

  render() {
    return (
      <div className="header">
        <h1>Endopage365</h1>
        <div className="right-menu">
            <a className="button outline">Print</a>
            <a className="button outline">Save</a>
            <a className="button outline">Next</a>
            <img src={require('../../Assets/x.svg')} alt="X"/>
        </div>
      </div>
    );
  }

}

export default Header;
