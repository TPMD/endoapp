import React, { Component } from 'react';
import { expect } from 'chai'
import { browserHistory } from 'react-router';
import moment from 'moment';

import superagent from 'superagent';
import { API } from '../../env';

import classname from 'classname';

import keydown from 'react-keydown'

import './Home.scss';
//import Header from '../../Components/Header/Header';

var timer_timeout;
var timer_timeout2;
var timer_timeout3;
//var stream;
var timer = 0;
var timeInterval = 120;
var setTime = 0;
var recorder;
var chunks = [];
var click = 0;
var snapPhotoInterval
const picCountLookup = {
  30: 60,
  60: 120,
  90: 180,
  120: 340,
  200: 400
}

class Home extends Component {
  constructor(props) {
    super(props);
    const patient = localStorage.getItem('Patient')
    this.state = {
      'first_record': true,
      'record_popup': 0,
      'remove_popup': 0,
      'save_popup': 0,
      'save_successful_popup': 0,
      'save_successful': false,
      'print_popup': 0,
      'image_popup': 0,
      'exit_popup': 0,
      'saved': true,
      'dropdown_time': false,
      'dropdown_video': false,
      'stopped': true,
      'counter': 0,
      'recording': false,
      'devices': [],
      'activeDevice': {},
      'captures': [],
      'deleteScope': false,
      'highlightedCaptures': [],
      'PatientInfo': {
        'Patient_Name': localStorage.getItem('patientName'),
        'Patient_Id': localStorage.getItem('patientId'),
        'Patient_Insurance': localStorage.getItem('patientInsurance'),
        'Patient_Doctor': localStorage.getItem('patientDoctor'),
        'Patient_OperationType': localStorage.getItem('patientOperationType'),
        'Patient_Date': localStorage.getItem('patientCreatedAt')
      },
      'Scopes': [],
      'recordStartTime':null,
      'recordStopTime': null,
      'videoDuration':null
    }
    this.getVideoInputs = this.getVideoInputs.bind(this)
  }
  getVideoInputs() {
    let _this = this
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      var videoInputs = devices.filter((device, i) => {
        return device['kind'] === 'videoinput'
      })
      videoInputs = videoInputs.map((device, i) => {
        if (device['label'].length > 9) {
          device['label_short'] = device['label'].substr(0,9) + '...';
        }
        else if(device['label'].length === 0) {
          device['label_short'] = 'Facetime...'
        }
        return device;
      });
      _this.setState({
        devices: videoInputs,
        activeDevice: videoInputs[0]
      })
    }).catch((err) => {
      console.log('error getting input devices', err);
    });
  }
  componentDidMount() {
    console.log('home.js mounted')
    let _this = this;
    _this.getVideoInputs()
    _this.getScopes();
    _this.confirmRecord();
    setTimeout(() => _this.setState({
      loading:false
    }), 3000)
    _this.addScope()

    // superagent
    // .get(API + "/patient/" + localStorage["Patient_Id"])
    // .withCredentials()
    // .end((err, res) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     _this.setState({
    //       "PatientInfo": res.body
    //     })
    //   }
    // });
  }

  PlayVideo() {
    this.StopVideo();
    setTimeout(() => {
      let video = document.querySelector('video.video2');
      video.currentTime = setTime;
      video.play();
    }, 1000)
  }

  StopVideo() {
    clearInterval(timer_timeout);
    clearInterval(snapPhotoInterval)
    if (recorder.state === 'recording') {
      recorder.stop();
    }
    document.querySelector('video.video2').pause();
    this.forceUpdate();
  }

  DiscardVideo() {
    this.setState({
      'first_record': true,
      'stopped': true,
      'recording': false,
      'record_popup': false
    })
    timer = 0;
    chunks = [];
    this.confirmRecord();
  }

  ToggleRecordState() {
    let _this = this;
    if (this.state.recording === false) {
      _this.ToggleRecord();
      _this.setState({
        'recording': true
      });
    } else {
      _this.setState({
        'recording': false
      });
    }
  }

  ToggleRecord() {
    let _this = this;
    if (!_this.state.stream) {
      _this.confirmRecord();
      _this.setState({
        'record_popup': 0
      })
      return false;
    }
    if (recorder.state === 'inactive') {
      timer = 0
      let _this = this;
      if(setTime === 0) {
        snapPhotoInterval = setInterval(() => _this.SnapPhoto(), 100)
      }
      timer_timeout = setInterval(() => {
        timer += 1
      }, 600)
      snapPhotoInterval = setInterval(() => {
        let numPics = picCountLookup[setTime]
        if(_this.state.captures.length < numPics) {
          _this.SnapPhoto()
        }
        else {
          timer = 0
          _this.setState({
            'recording': false
          })
          _this.confirmRecord()
          _this.forceUpdate()
        }
      }, 300);
      recorder.start();
      _this.setState({
        'stopped': false
      })
      return false;
    }
    else if(recorder.state === 'recording') {
      if(setTime === 0) {
        snapPhotoInterval = setInterval(() => _this.SnapPhoto(), 500)
      }
      else {
        console.log('video recording and else called')
        timer_timeout = setInterval(() => {timer+=1}, 600)
        snapPhotoInterval = setInterval(() => {
        let numPics = picCountLookup[setTime]
        if(_this.state.captures.length < numPics) {
          _this.SnapPhoto()
          }
        else {
          clearInterval(timer_timeout)
          clearInterval(snapPhotoInterval)
        }
        }, 300);

      }
    }
  }

  @keydown( 'control+s' )
  SnapPhoto() {
    let _this = this;

    setTimeout(() => {
      var captures = this.state.captures;
      captures.push(timer);
      this.setState({
        captures: captures,
        'saved': false
      })

      var canvas = document.querySelector('div.canvas-padding:last-of-type canvas');
      var context = canvas.getContext('2d');

      var video = document.querySelector('video');
      var w, h, ratio;
      ratio = video.videoWidth / video.videoHeight;
      w = video.videoWidth - 100;
      h = parseInt(w / ratio, 10);
      canvas.width = w;
      canvas.height = h;

      console.log(w, h);
      context.fillRect(0, 0, w, h);
      context.drawImage(video, 0, 0, w, h);

      var highlightedCaptures = _this.state.highlightedCaptures;
      highlightedCaptures.push(0);
      _this.setState({
        'highlightedCaptures': highlightedCaptures
      })
    }, 50);
  }

  HighlightAll() {
    var highlightedCaptures = this.state.highlightedCaptures.map((hc, i) => {
      if (hc === 0) {
        return 1;
      } else {
        return hc;
      }
    });
    this.setState({
      'highlightedCaptures': highlightedCaptures
    })
    this.forceUpdate();
  }

  UnhighlightAll() {
    var highlightedCaptures = this.state.highlightedCaptures.map((hc, i) => {
      return 0;
    });
    this.setState({
      'highlightedCaptures': highlightedCaptures
    })
    this.forceUpdate();
  }

  HighlightThis(i) {
    clearTimeout(timer_timeout3);
    if (click === 1) {
      this.setState({
        'image_popup': 1
      })
      var video = document.querySelector('video');
      var w, h, ratio;
      ratio = video.videoWidth / video.videoHeight;
      w = video.videoWidth - 100;
      h = parseInt(w / ratio, 10);
      let png = document.querySelector('div.canvas-padding:nth-child('+ (i + 1) +') canvas').toDataURL('image/png');
      document.querySelector('div.image-popup img.showcased-image').src = png;
    }
    click = 1;
    timer_timeout3 = setTimeout(() => {
      click = 0;
    }, 250);
    var highlightedCaptures = this.state.highlightedCaptures;
    if (highlightedCaptures[i] === 0) {
      highlightedCaptures[i] = 1;
    } else {
      highlightedCaptures[i] = 0;
    }
    console.log(highlightedCaptures);
    this.setState({
      'highlightedCaptures': highlightedCaptures
    })
  }

  RemoveHighlightedCaptures() {
    var highlightedCaptures = this.state.highlightedCaptures.map((hc, i) => {
      if (hc === 1) {
        return -1;
      } else {
        return hc;
      }
    });
    this.setState({
      'highlightedCaptures': highlightedCaptures,
    });
    this.removePopup();
    var _this = this;
    setTimeout(() => {
      _this.forceUpdate();
    }, 25);
  }

  SaveImages() {
    var _this = this;
    this.setState({
      'saved': true,
      'save_successful_popup': 1
    })
    this.state.highlightedCaptures.forEach((hc, i) => {
      if (hc === 1) {
        var canvas = document.querySelector('div.canvas-padding.canvas-index-' + i + ' canvas');
        var duration = this.state.captures[i];

        var formData = new FormData();

        formData.append('Patient_Id', localStorage["Patient_Id"])
        formData.append('Images_CaptureTime', duration)
        formData.append('img', _this.CanvasToBlob(canvas.toDataURL('image/png')))

        // superagent
        // .post(API + '/images')
        // .withCredentials()
        // .send(formData)
        // .end((err, res) => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     console.log("Image saved...");
        //   }
        // })
      }
    });
  }

  CanvasToBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  deleteScope(index, e) {
    let Scopes = this.state.Scopes
    if(index === 1) {
      Scopes.splice(index, index)
    }
    else if(index > 1) {
      Scopes.splice(index, 1)
    }
    else if(index < 1) {
      Scopes = []
    }
    this.setState({
      Scopes
    })
  }

  updateScope(index, key, e) {
    var Scopes = this.state.Scopes;
    Scopes[index][key] = e.target.value;
    this.setState({
      Scopes: Scopes
    })
    let _this = this;
    clearTimeout(timer_timeout2);
    timer_timeout2 = setTimeout(() => {
      _this.pushScopes(index);
    }, 500);
  }

  addScope() {
    var Scopes = this.state.Scopes;
    Scopes.push(
      {
        'Scope_Model': '',
        'Scope_SerialNumber': '',
        'Scope_StartTime': '',
        'Scope_StopTime1': '',
        'Scope_StopTime2': '',
        'Scope_Duration': '',
      }
    )
    this.setState({
      Scopes: Scopes
    })
  }

  getScopes() {
    var _this = this;
    _this.setState({
      Scopes:[]
    })
    // superagent
    // .get(API + '/scope?Patient_Id=' + localStorage.Patient_Id)
    // .withCredentials()
    // .end((err, res) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     if (res.body.length > 0) {
    //       _this.setState({
    //         'Scopes': res.body
    //       })
    //     }
    //   }
    // })
  }

  pushScopes(index) {
    let _this = this;
    let Scope = this.state.Scopes[index];
    Scope['Patient_Id'] = localStorage['Patient_Id'];
    // superagent
    // .post(API + '/scope')
    // .send(Scope)
    // .withCredentials()
    // .end((err, res) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     _this.getScopes()
    //   }
    // })
  }

  confirmRecord() {
    var video = document.querySelector('video.video1');
    var video2 = document.querySelector('video.video2');
    var _this = this;

    if (navigator.mediaDevices.getUserMedia) {
      console.log(_this.state.activeDevice['deviceId']);
      navigator.mediaDevices.getUserMedia({audio: false, video: {
        deviceId: { exact: _this.state.activeDevice['deviceId'] }
      }}).then((stream) => {
        _this.setState({
          'first_record': false,
          'stopped': false,
          'recording': false,
          stream: stream
        });
        video.src = window.URL.createObjectURL(stream);
        recorder = new MediaRecorder(stream, {
          videoBitsPerSecond : 2500000,
          mimeType : 'video/webm'
        })
        recorder.start();
        recorder.onstart = function(e) {
          console.log('recording started')
          _this.setState({
            'recordStartTime': moment.now()
          })
        }
        recorder.ondataavailable = function(e) {
          if (_this.state.recording === true) {
            chunks.push(e.data);
          }
        }
        recorder.onstop = function(e) {
          console.log('recorder stopped', _this.state.recordStartTime)
          _this.setState({
            recordStopTime: moment.now(),
            videoDuration: moment(_this.state.recordStartTime).diff(moment.now(), 'minutes')
          })
          var blob = new Blob(chunks, { 'type' : 'video/webm' });
          video2.src = window.URL.createObjectURL(blob);
          video2.load();
          video2.addEventListener('loadedmetadata', () => {
            video2.currentTime = timer;
            setTimeout(() => {
              _this.setState({
                'stopped': true,
                'recording': false
              })
            }, 100)
          }, false)
          _this.PlayVideo().bind(this)
        }
        clearInterval(timer_timeout);
      }, (error) => {
        console.log("Something went wrong...")
      });
    }
  }

  cancelRecord() {
    var highlightedCaptures = this.state.highlightedCaptures.map((hc, i) => {
      return -1;
    });
    this.setState({
      'highlightedCaptures': highlightedCaptures
    });
    this.recordPopup();
  }

  goBack() {
    browserHistory.push("/patient");
  }

  removePopup() {
    if (this.state.remove_popup === 0) {
      this.setState({
        'remove_popup': 1
      })
    } else {
      this.setState({
        'remove_popup': 0
      })
    }
  }

  savePopup() {
    if (this.state.save_popup === 0) {
      this.setState({
        'save_popup': 1,
        'exit_popup': 0
      })
    } else {
      this.setState({
        'save_popup': 0
      })
    }
  }

  printPopup() {
    this.forceUpdate();
    if (this.state.print_popup === 0) {
      this.setState({
        'print_popup': 1
      })
    } else {
      this.setState({
        'print_popup': 0
      })
    }
  }

  PrintCanvases() {
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>'
    this.state.highlightedCaptures.forEach((hc, i) => {
      if (hc === 1) {
        var dataUrl = document.querySelector('div.canvas-padding.canvas-index-' + i + ' canvas').toDataURL();
        windowContent += '<img src="' + dataUrl + '" style="display: block; width: 100%; margin: 15px 0;">';
      }
    });
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('','','width=800,height=1200');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    setTimeout(() => {
      printWin.focus();
      printWin.print();
      printWin.close();
    }, 250);
  }

  recordPopup() {
    if (this.state.record_popup === 0) {
      this.setState({
        'record_popup': 1
      })
    } else {
      this.setState({
        'record_popup': 0
      })
    }
  }

  exitPopup() {
    console.log('exit popup called')
    console.log('been saved already ?', this.state.saved)
    console.log('exit popup value', this.state.exit_popup)
    if (this.state.saved === false) {
      if (this.state.exit_popup === 0) {
        this.setState({
          'exit_popup': 1
        })
      } else {
        this.setState({
          'exit_popup': 0
        })
      }
    } else {
      if (chunks.length === 0) {
        this.goBack();
      } else {
        this.savePopup();
      }
    }
  }

  dropdownTime() {
    if (this.state.dropdown_time === false) {
      this.setState({
        dropdown_time: true
      })
    } else {
      this.setState({
        dropdown_time: false
      })
    }
  }

  dropdownVideo() {
    if (this.state.dropdown_video === false) {
      this.setState({
        dropdown_video: true
      })
    } else {
      this.setState({
        dropdown_video: false
      })
    }
  }

  updateDevice(i, e) {
    this.dropdownVideo();
    this.setState({
      'activeDevice': this.state.devices[i]
    });
    if (this.state.stream) {
      this.confirmRecord();
    }
  }

  toggleDeleteButton() {
    if (this.state.deleteScope === false) {
      this.setState({
        deleteScope: true
      })
    } else {
      this.setState({
        deleteScope: false
      })
    }
  }

  imagePopup() {
    if (this.state.image_popup === false) {
      this.setState({
        image_popup: true
      })
    } else {
      this.setState({
        image_popup: false
      })
    }
  }
  removeSuccessFulPopUp() {
    this.setState({
      save_successful_popup: 0
    })
  }


  render() {
    let recordPopup = classname({
      'popup': true,
      'record-popup': true,
      'visible': this.state.record_popup === 1
    })

    let removePopup = classname({
      'popup': true,
      'remove-popup': true,
      'visible': this.state.remove_popup === 1
    })

    let savePopup = classname({
      'popup': true,
      'save-popup': true,
      'visible': this.state.save_popup === 1
    })

    let saveSuccessFullPopUp = classname({
      popup:true,
      'save-successful-popup': true,
      'visible': this.state.save_successful_popup === 1
    })

    let printPopup = classname({
      'popup': true,
      'print-popup': true,
      'visible': this.state.print_popup === 1
    })

    let exitPopup = classname({
      'popup': true,
      'exit-popup': true,
      'visible': this.state.exit_popup === 1
    })

    let imagePopup = classname({
      'popup': true,
      'image-popup': true,
      'visible': this.state.image_popup === 1
    })

    let SelectAll = classname({
      'button': true,
      'grey': this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 || hc === 0 }).length === 0,
      'light': this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 || hc === 0 }).length > 0,
      'invisible': this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 }).length > 0
    })

    let DeselectAll = classname({
      'button': true,
      'invisible': this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 }).length === 0
    })

    let RemoveAll = classname({
      'button': true,
      'light': true,
      'invisible-pe': this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 }).length === 0
    })

    let CaptureState = classname({
      'invisible': this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 }).length === 0
    })

    let Video1 = classname({
      'video1': true,
      'active': this.state.stopped === false
    })

    let Video2 = classname({
      'video2': true,
      'active': this.state.stopped === true
    })

    let Record1 = classname({
      'icon': true,
      'invisible': this.state.recording === true
    })

    let Record2 = classname({
      'icon': true,
      'invisible': this.state.recording === false
    })

    let DropdownTime = classname({
      'marker-content': true,
      'invisible': this.state.dropdown_time === false
    })

    let DropdownVideo = classname({
      'marker-content': true,
      'invisible': this.state.dropdown_video === false
    })

    let DeleteButton = classname({
      'delete': true,
      'button': true,
      'invisible': this.state.deleteScope === false
    })

    var EditText = "Edit";
    if (this.state.deleteScope === true) {
      EditText = "Done";
    }

    var timeLoc = timeInterval;

    var startTime = this.state.recordStartTime ? moment(this.state.recordStartTime).calendar(): ''
    var stopTime = this.state.recordStopTime ? moment(this.state.recordStopTime).calendar(): ''
    var videoDuration = this.state.videoDuration ? moment(this.state.videoDuration): ''
    try {
      this.state.Scopes[0].Scope_StartTime = startTime
      this.state.Scopes[0].Scope_StopTime1 = stopTime
    }
    catch(err) {

    }
    if(this.state.recordStopTime && this.state.recordStartTime) {
      this.state.Scopes[0].Scope_Duration = moment(this.state.recordStartTime).diff(moment(this.state.recordStopTime), 'minutes')
    }
    return (
      <div className="home">
        <div className={saveSuccessFullPopUp}>
          <div className="popup-wrap">
            <p>Your images were saved successfully!</p>
            <a className="btn white" onClick={this.removeSuccessFulPopUp.bind(this)}>Ok</a>
          </div>
        </div>
        <div className={imagePopup} onClick={this.imagePopup.bind(this)}>
          <img className="img-exit" role='presentation' src={require('../../Assets/img.exit.svg')}/>
          <div className="popup-wrap">
            <img role='presentation' className="showcased-image"/>
          </div>
        </div>

        <div className={removePopup}>
          <div className="popup-wrap">
            <p>Are you sure you want to remove these images?</p>
            <a className="btn blue" onClick={this.RemoveHighlightedCaptures.bind(this)}>Remove</a>
            <a className="btn white" onClick={this.removePopup.bind(this)}>Cancel</a>
          </div>
        </div>

        <div className={recordPopup}>
          <div className="popup-wrap">
            <p>Are you sure you want to discard this recording?</p>
            <a className="btn blue" onClick={this.DiscardVideo.bind(this)}>Discard</a>
            <a className="btn white" onClick={this.recordPopup.bind(this)}>Cancel</a>
          </div>
        </div>

        <div className={savePopup}>
          <div className="popup-wrap">
            <p>You have a video recording for this procedure. Would you like to save it?</p>
            <a className="btn blue" onClick={this.goBack.bind(this)}>Save</a>
            <a className="btn blue" onClick={this.goBack.bind(this)}>Dont Save</a>
          </div>
        </div>

        <div className={printPopup}>
          <div className="popup-wrap">
            <p>Are you sure you want to print these images?</p>
            <a className="btn blue" onClick={this.PrintCanvases.bind(this)}>Print</a>
            <a className="btn white" onClick={this.printPopup.bind(this)}>Cancel</a>
          </div>
        </div>

        <div className={exitPopup}>
          <div className="popup-wrap">
            <p>Would you like to save this procedure first?</p>
            <a className="btn blue" onClick={this.savePopup.bind(this)}>Save</a>
            <a className="btn white" onClick={this.exitPopup.bind(this)}>Cancel</a>
          </div>
        </div>

        <div className="header">
          <h1>Image Capture</h1>
          <div className="right-menu">
              <a className="button outline" onClick={this.printPopup.bind(this)}>Print</a>
              <a className="button outline" onClick={this.SaveImages.bind(this)}>Save</a>
              <img src={require('../../Assets/x.svg')} alt="X" onClick={this.exitPopup.bind(this)}/>
          </div>
        </div>
        <div className="two-columns special">
          <div className="column">
            <div className="card image-capture">
              <div className="card-header no-margin">
                <h3 className="title">Image Capture</h3>
                <div className="button-wrap">
                  {
                    (
                      <p className="image-index">
                        <span className={CaptureState}>
                          {this.state.highlightedCaptures.filter((hc, i) => { return hc === 1 }).length}
                          /
                        </span>
                        {this.state.highlightedCaptures.filter((hc, i) => { return hc !== -1 }).length}
                        <span> Images <span className={CaptureState}>selected</span></span>
                      </p>
                    )
                  }
                  <a className={SelectAll} onClick={this.HighlightAll.bind(this)}>Select All</a>
                  <a className={DeselectAll} onClick={this.UnhighlightAll.bind(this)}>Deselect</a>
                  <a className={RemoveAll} onClick={this.removePopup.bind(this)}>Remove</a>
                </div>
              </div>
              <div className="canvases">
                {
                  this.state.captures.map((capture, i) => {
                    var canvasIndex = 'canvas-index-' + i;
                    var canvasClass = classname({
                      'highlighted': this.state.highlightedCaptures[i] === 1,
                      'invisible': this.state.highlightedCaptures[i] === -1,
                      'canvas-padding': true
                    })
                    canvasClass += " " + canvasIndex;
                    return(
                      <div className={canvasClass} onClick={this.HighlightThis.bind(this, i)} key={i}>
                        <p>{capture.toFixed(2)} seconds</p>
                        <canvas></canvas>
                      </div>
                    )
                  }, this)
                }
              </div>
            </div>
          </div>
          <div className="column">
            <div id='patientInfo' className="card border margin-top">
              <h3 className="padding">{this.state.PatientInfo.Patient_Name}</h3>
              <h3 className="">{this.state.PatientInfo.Patient_HospitalId}</h3>
              <div className="line"></div>
              <h3 className="padding">{this.state.PatientInfo.Patient_OperationType}</h3>
              <div className="line"></div>
              <h3 className="padding">{this.state.PatientInfo.Patient_Id}</h3>
              <div className="line"></div>
              <h3 className="padding">{moment.utc(Number(this.state.PatientInfo.Patient_Date)).format('YYYY-MM-DD')}</h3>
              <div className="line"></div>
              <h3 className="padding">{this.state.PatientInfo.Patient_Doctor}</h3>
              <div className="line"></div>
              <h3 className="padding">{this.state.PatientInfo.Patient_Insurance}</h3>
              <div className="line"></div>  
            </div>
          </div>
        </div>
        <div className="two-columns even">
          <div className="column">
            <div className="card priority">
              <div className="flex-end">
                <img src={require('../../Assets/stillimage.png')} role='presentation' className="still-image" onClick={this.SnapPhoto.bind(this)}/>
              </div>
              <div className="buttons">
                <div className="marker-dropdown wide">
                  <div className="marker-header" onClick={this.dropdownVideo.bind(this)}>
                    {this.state.activeDevice['label_short']}
                    <img role='presentation' src={require("../../Assets/down_arrow.svg")}/>
                  </div>
                  <div className={DropdownVideo}>
                    {
                      this.state.devices.map((device, i) => {
                        return(
                          <p key={i} onClick={this.updateDevice.bind(this, i)}>{device['label_short']}</p>
                        )
                      })
                    }
                  </div>
                </div>
                <div className="marker-dropdown">
                  <div className="marker-header" onClick={this.dropdownTime.bind(this)}>
                    <p>
                    {(Math.floor((setTime) / 60) * 1)}
                    :
                    {("0" + (Math.floor((setTime) / 30) * 30) % 60).slice(-2)}</p>
                    <img src={require("../../Assets/down_arrow.svg")} role='presentation'/>
                  </div>
                  <div className={DropdownTime}>
                    {
                      Array.apply(0, Array(Math.floor(timeLoc / 30) + 1)).map((index, i) => {
                        return(
                          <p key={i} onClick={() => {
                            setTime = i * 30;
                            document.querySelector('video.video2').currentTime = setTime;
                            this.dropdownTime();
                          }}>{Math.floor((i) / 2)}:{("0" + Math.floor((i) * 30) % 60).slice(-2)}</p>
                        )
                      }, this)
                    }
                  </div>
                </div>
                <img src={require("../../Assets/record.svg")} role='presentation'  className={Record1} onClick={this.ToggleRecordState.bind(this)}/>
                <img src={require("../../Assets/record_active.svg")} role='presentation' className={Record2} onClick={this.ToggleRecordState.bind(this)}/>
                <img src={require("../../Assets/stop.svg")} role='presentation' className="icon" onClick={this.StopVideo.bind(this)}/>
                <img src={require("../../Assets/play.svg")} role='presentation' className="icon" onClick={this.PlayVideo.bind(this)}/>
              </div>
              <div className="videos">
                <img role='presentation' src={require('../../Assets/exit.svg')} className="icon exit-icon" onClick={this.recordPopup.bind(this)}/>
                <video width="320" height="240" className={Video1}></video>
                <video width="320" height="240" className={Video2}></video>
              </div>
            </div>
          </div>
          <div className="column" id='scope-info'>
            <div className="card no-padding margin-top-2">
              <div className="card-header">
                <h2>Scope Information</h2>
                <div className="btn-wrap">
                  <a id='add-new'className="button outline primary" onClick={this.addScope.bind(this)}><span className="bold"><img id='plus-img'role='presentation' src={require('../../Assets/plus.svg')}/></span> Add New</a>
                  <a className="button outline primary margin-right" onClick={this.toggleDeleteButton.bind(this)}>{EditText}</a>
                </div>
              </div>
              <div className="bordered-table">
                <table>
                  <thead>
                    <tr className="header">
                      <td>Model</td>
                      <td>Serial Number</td>
                      <td>Start Time</td>
                      <td>Stop Time 1</td>
                      <td>Stop Time 2</td>
                      <td>Duration (min)</td>
                    </tr>
                  </thead>
                </table>
                <table>
                  <tbody>
                  {
                    this.state.Scopes.map((Scope, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <img className={DeleteButton} role='presentation' onClick={this.deleteScope.bind(this, i)} src={require('../../Assets/minus.svg')}/>
                            <input value={Scope['Scope_Model']} onChange={this.updateScope.bind(this, i, 'Scope_Model')}/>
                          </td>
                          <td><input value={Scope['Scope_SerialNumber']} onChange={this.updateScope.bind(this, i, 'Scope_SerialNumber')}/></td>
                          <td><input value={Scope['Scope_StartTime']} onChange={this.updateScope.bind(this, i, 'Scope_StartTime')}/></td>
                          <td><input value={Scope['Scope_StopTime1']} onChange={this.updateScope.bind(this, i, 'Scope_StopTime1')}/></td>
                          <td><input value={Scope['Scope_StopTime2']} onChange={this.updateScope.bind(this, i, 'Scope_StopTime2')}/></td>
                          <td><input value={Scope['Scope_Duration']} onChange={this.updateScope.bind(this, i, 'Scope_Duration')}/></td>
                        </tr>
                      )
                    }, this)
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Home;
