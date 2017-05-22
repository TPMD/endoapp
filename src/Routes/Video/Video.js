import React, { Component } from 'react'
import './video.scss'


class Video extends Component {
  constructor(props) {
    super(props)
    this.startRecord = this.startRecord.bind(this)
    this.getVideoInputs = this.getVideoInputs.bind(this)
    this.stopRecord = this.stopRecord.bind(this)
    this.convertStreams = this.convertStreams.bind(this)
    this.processInWebWorker = this.processInWebWorker.bind(this)
    this.PostBlob = this.PostBlob.bind(this)
    this.postMessage = this.postMessage.bind(this)
    this.log = this.log.bind(this)
    this.state = {
      devices: [],
      activeDevice: null,
      recordVideo:null,
      videoPreview:null,
      inner:null,
      videoFile: !!navigator.mozGetUserMedia ? 'video.gif' : 'video.webm',
      worker: null,
      aab: null
    }

  }
  componentDidMount() {
    this.getVideoInputs()
  }
  getVideoInputs() {
    let _this = this
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      let videoInputs = devices.filter((device, i) => {
        return device['kind'] === 'videoinput'
      })
      videoInputs = videoInputs.map((device, i) => {
        if(device !== undefined) {
          if (device['label'].length > 9) {
            device['label_short'] = device['label'].substr(0,9) + '...';
          }
          else if(device['label'].length === 0) {
            device['label_short'] = 'Facetime...'
          }
          return device
        }
      });
      if(videoInputs.length > 0) {
        _this.setState({
          devices: videoInputs,
          activeDevice: videoInputs[0]
        })
      }
    }).catch((error) => {
      _this.setState({
        error
      })
    });
  }
  startRecord() {
    let videoPreview = document.getElementById('video-preview')
    let inner = document.querySelector('.inner')
    let recordVideo
    this.setState({
      videoPreview,
      inner
    })
    console.log('starting to record...')
    if(navigator.mediaDevices.getUserMedia) {
      console.log('got navigator mediaDecies.getUsermedia')
      navigator.mediaDevices.getUserMedia({audio:false, video:{
        deviceId: {exact: this.state.activeDevice['deviceId']}
      }})
      .then(stream => {
        console.log('got stream')
        console.log('record rtc', global.RecordRTC)
        videoPreview.src = window.URL.createObjectURL(stream)
        recordVideo = global.RecordRTC(stream, {
          type: 'video'
        })
        this.setState({recordVideo})
        recordVideo.startRecording()
      })
      .catch(error => {
        this.setState({
          error: error
        })
      })
    }
  }

  log(message) {
    console.log('log called')
    let logsPreview = document.getElementById('logs-preview');
    let li = document.createElement('li');
    li.innerHTML = message;
    logsPreview.appendChild(li);
    li.tabIndex = 0;
    li.focus();
  }

  convertStreams(videoBlob) {
    console.log('converting streams', videoBlob)
    let aab
    let posted
    let fileReader = new FileReader()
    console.log('should have a file reader instance', fileReader)
    fileReader.onload = () => {
      aab = this.result
      this.setState({
        aab
      })
      this.postMessage()

    }
    fileReader.readAsArrayBuffer(videoBlob)
    if(!this.state.worker) {
      this.processInWebWorker()
    }
  }

  processInWebWorker() {
    console.log('process in web worker', this.state.worker)
    let workerReady
    let buffersReady
    let log = this.log
    console.log('processing in web worker')
    let workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
    console.log('got worker path', workerPath)
    let blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
                        type: 'application/javascript'
                    }));
    let worker = new Worker(blob)
    console.log('got blob', blob)
    worker.onmessage = function(event) {
        console.log('worker', event)
        console.log('worker got message', event.data)
        var message = event.data;
        if (message.type == "ready") {
            log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
            workerReady = true;
            if (buffersReady)
                postMessage();
        } else if (message.type == "stdout") {
            log(message.data);
        } else if (message.type == "start") {
            log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
        } else if (message.type == "done") {
            log(JSON.stringify(message));
            var result = message.data[0];
            log(JSON.stringify(result));
            var blob = new Blob([result.data], {
                type: 'video/mp4'
            });
            log(JSON.stringify(blob));
            this.PostBlob(blob);
        }
    };
    URL.revokeObjectURL(blob)
    this.setState({
      worker
    })
  }

  PostBlob(blob) {
    console.log('posting blob', blob)
    let inner = this.state.inner
    let video = document.createElement('video');
    video.controls = true;
    let source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    source.type = 'video/mp4; codecs=mpeg4';
    video.appendChild(source);
    video.download = 'Play mp4 in VLC Player.mp4';
    inner.appendChild(document.createElement('hr'));
    let h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4" style="font-size:200%;color:red;">Download Converted mp4 and play in VLC player!</a>';
    inner.appendChild(h2);
    h2.style.display = 'block';
    inner.appendChild(video);
    video.tabIndex = 0;
    video.focus();
    video.play();
  }
  stopRecord() {
    console.log('stopping record')
    let videoPreview = this.state.videoPreview
    let videoFile = this.state.videoFile
    this.state.recordVideo.stopRecording(url => {
      console.log('got video url', url)
      videoPreview.src = url
      videoPreview.download = videoFile
      this.setState({
        videoPreview,
        videoFile
      })
      console.log('video download', this.state.videoPreview.download)
      console.log('video src', this.state.videoPreview.src)
      console.log('should get blob', this.state.recordVideo.getBlob())
      this.convertStreams(this.state.recordVideo.getBlob())
    })
  }

  postMessage(message) {
    console.log('posting message', message)
    this.state.worker.postMessage({
            type: 'command',
            arguments: [
                '-i', this.state.videoFile,
                '-c:v', 'mpeg4',
                '-b:v', '6400k',
                '-strict', 'experimental', 'output.mp4'
            ],
            files: [
                {
                    data: new Uint8Array(this.state.aab),
                    name: this.state.videoFile
                }
            ]
        });
  }


  render() {
    console.log(this.state.activeDevice)
    console.log(this.state.devices)
    return (
      <div className='video-container'>
        <div className="inner">
            <button onClick={this.startRecord} id="record-video">Record</button>
            <button onClick={this.stopRecord} id="stop-recording-video">Stop</button>
            <br></br>
            <video id="video-preview" controls></video>
            <br></br>
        </div>
        <ol id="logs-preview">
            <li>
                <a href="https://www.webrtc-experiment.com/RecordRTC/">RecordRTC</a> experiment converting WebM to mp4 inside the browser!
            </li>
        </ol>
      </div>
    )
  }

}
export default Video
