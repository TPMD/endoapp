import React, { Component } from 'react'


class Video extends Component {
  constructor(props) {
    super(props)
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
     var recordVideo;
                var videoPreview = document.getElementById('video-preview');
                var inner = document.querySelector('.inner');
                var videoFile = !!navigator.mozGetUserMedia ? 'video.gif' : 'video.webm';

                document.querySelector('#record-video').onclick = function() {
                    this.disabled = true;
                    navigator.getUserMedia({
                            video: true
                        }, function(stream) {
                            videoPreview.src = window.URL.createObjectURL(stream);
                            videoPreview.play();

                            recordVideo = global.RecordRTC(stream, {
                                type: 'video',
                                // recorderType: !!navigator.mozGetUserMedia ? MediaStreamRecorder : WhammyRecorder
                            });

                            recordVideo.startRecording();
                        }, function(error) { throw error;});
                    document.querySelector('#stop-recording-video').disabled = false;
                };

                document.querySelector('#stop-recording-video').onclick = function() {
                    this.disabled = true;

                    recordVideo.stopRecording(function(url) {
                        videoPreview.src = url;
                        videoPreview.download = videoFile;

                        log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file download started. It is about 18MB in size; please be patient!');
                        convertStreams(recordVideo.getBlob());
                    });
                };

                var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';

                function processInWebWorker() {
                    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
                        type: 'application/javascript'
                    }));

                    var worker = new Worker(blob);
                    URL.revokeObjectURL(blob);
                    return worker;
                }

                var worker;

                function convertStreams(videoBlob) {
                    var aab;
                    var buffersReady;
                    var workerReady;
                    var posted;

                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                        aab = this.result;
                        postMessage();
                    };
                    fileReader.readAsArrayBuffer(videoBlob);

                    if (!worker) {
                        worker = processInWebWorker();
                    }

                    worker.onmessage = function(event) {
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

                            PostBlob(blob);
                        }
                    };
                    var postMessage = function() {
                        posted = true;

                        worker.postMessage({
                            type: 'command',
                            arguments: [
                                '-i', videoFile,
                                '-c:v', 'mpeg4',
                                '-b:v', '6400k',
                                '-strict', 'experimental', 'output.mp4'
                            ],
                            files: [
                                {
                                    data: new Uint8Array(aab),
                                    name: videoFile
                                }
                            ]
                        });
                    };
                }

                function PostBlob(blob) {
                  console.log('posting blob')
                    var video = document.createElement('video');
                    video.controls = true;

                    var source = document.createElement('source');
                    source.src = URL.createObjectURL(blob);
                    source.type = 'video/mp4; codecs=mpeg4';
                    video.appendChild(source);

                    video.download = 'Play mp4 in VLC Player.mp4';

                    inner.appendChild(document.createElement('hr'));
                    var button = document.createElement('button');
                    button.innerHTML = '<a href="' + source.src + '" target="_blank" id="download-video" download="Play mp4 in VLC Player.mp4" style="font-size:200%;color:red;">Download Converted mp4 and play in VLC player!</a>';
                    inner.appendChild(button);
                    button.style.display = 'block';
                    document.getElementById('download-video').click()
                    inner.appendChild(video);

                    video.tabIndex = 0;
                    video.focus();
                    video.play();

                    document.querySelector('#record-video').disabled = false;
                }

                var logsPreview = document.getElementById('logs-preview');

                function log(message) {
                    // var li = document.createElement('li');
                    // li.innerHTML = message;
                    // logsPreview.appendChild(li);

                    // li.tabIndex = 0;
                    // li.focus();
                }

                window.onbeforeunload = function() {
                    document.querySelector('#record-video').disabled = false;
                };
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

      </div>
    )
  }

}
export default Video
