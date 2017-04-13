import { connect } from 'react-redux'
import React, { Component } from 'react'
import Navbar from '../Components/Navbar'
import PopUp from '../Components/PopUp'
import ImageCapture from '../Components/ImageCapture'
import PictureCanvas from '../Components/PictureCanvas'
import PatientInfo from '../Components/PatientInfo'
import VideoSource from '../Components/VideoSource'
import CaptureFrequency from '../Components/CaptureFrequency'
import ScopeInformation from '../Components/ScopeInformation'
import classname from 'classname'
//import WebCamContainer from './WebCamContainer'
//import Webcam from 'react-user-media'

import '../scss/Home.scss';

class _HomeContainer extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      currentAction: null,
      printSelected: false,
      saveSelected: false,
      nextSelected: false,
      popUpDisplay: false,
      recording:false,
      popUpMessage: '',
      popUpChildren: []
    }
  }

  onPrintSelected() {
    console.log('print selected')
    this.setState({
      printSelected: true,
      popUpDisplay: true,
      currentAction: 'Print',
      popUpMessage: 'Are you sure you want to print these pictures?',
      popUpChildren: [
        <a className='btn blue' key={0} onClick={() => this.handlePopUpAction('confirm')}> Yes </a>,
        <a className='btn red'  key={1} onClick={() => this.handlePopUpAction('deny')}> No </a>
      ]
    })
  }
  onSaveSelected() {
    this.setState({
      saveSelected: true
    })
  }
  onNextSelected() {
    this.setState({
      nextSelected: true
    })
  }

  onClick(item, key){
    console.log('on click called', item)
    const navbarItemFunctions = {
      'Print': this.onPrintSelected.bind(this),
      'Save': this.onSaveSelected.bind(this),
      'Next': this.onNextSelected.bind(this)
    }
    return navbarItemFunctions[item.text]()
  }

  submit(action) {
    switch(this.state.currentAction) {
      case 'Print':
        console.log('should print pictures')
        this.setState({
          popUpDisplay:false
        })
        return
      case 'Save':
        console.log('should save')
        this.setState({
          popUpDisplay:false
        })
        return
      case 'Exit':
        console.log('should exit')
        this.setState({
          popUpDisplay:false
        })
        return
      default:
        this.setState({
          currentAction: null
        })

    }

  }

  handlePopUpAction(actionType) {
    console.log('handling popup action', actionType)
    switch(actionType) {
      case 'confirm':
        return this.submit(actionType)
      case 'deny':
        return this.setState({
          popUpDisplay: false,
          popUpChildren: [],
          popUpMessage: ''
        })
      default:
        return
    }
  }

  render() {
    const navbarItems = [{
      text: 'Save',
      className: 'button outline'
    }, 
      {
      text: 'Print',
      className:'button outline'
    },
    {
      text: 'Next',
      className: 'button outline'
    }
    ]
    const mockPatient = {
      Name: 'Jon Kolman',
      hospitalId: 123123,
      operationType: 'surgery',
      patientDate: new Date(),
      doctor: 'jeremy',
      insurance: 'geico'

    }
    const Record = classname({
      'icon': true,
      'invisible': this.state.recording === true
    })
    let Video1 = classname({
      'video1': true,
      'active': this.state.stopped === false
    })

    let Video2 = classname({
      'video2': true,
      'active': this.state.stopped === true
    })
    return (
      <div className='home'> 
        <Navbar 
          heading='Image Capture' 
          navbarItems={navbarItems}
          onClick={this.onClick.bind(this)}
          >
          <img src={require('../Assets/x.svg')} alt="X" />
        </Navbar>
        <PopUp message={this.state.popUpMessage} show={this.state.popUpDisplay} handlePopUpAction={() => this.setState({
            popUpDisplay:false
          })}> 
          {this.state.popUpChildren}
        </PopUp>
        <div className='two-columns special'>
          <ImageCapture 
            showSelectedImageCount={true} 
            selectedImageCount={3}
            showSelectAll={true}
            showDeselectAll={false}
          >
            <PictureCanvas images={[]} />
          </ImageCapture>
          <PatientInfo patient={mockPatient} />
        </div>
        <div className='two-columns even'> 
          <div className='column'> 
            <div className='card priority'> 
              <div className='flex-end'> 
                <img src={require('../Assets/stillimage.png')} role='presentation' className="still-image" />
              </div>
              <div className='buttons'> 
                <VideoSource devices={[]} activeDevice={null} show={true} />
                <CaptureFrequency />
                <img src={require("../Assets/record.svg")} role='presentation'  className={Record}/>
              </div>
              <div className='videos'> 
                <img role='presentation' src={require('../Assets/exit.svg')} className="icon exit-icon"/>
                <video width="320" height="240" className={Video1}></video>
                <video width="320" height="240" className={Video2}></video>
              </div>
            </div>
          </div>
          <ScopeInformation scopes={[]} updateScope={(index) => console.log(index)} />
        </div>
      </div>
    )
  }
}

export default connect(state => state)(_HomeContainer)