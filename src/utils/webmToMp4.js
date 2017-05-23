var recordVideo;
var videoPreview = document.getElementById('video-preview');
var inner = document.querySelector('.inner');
var videoFile = !!navigator.mozGetUserMedia ? 'video.gif' : 'video.webm';

// document.querySelector('#record-video').onclick = function() {
//     this.disabled = true;
//     navigator.getUserMedia({
//             video: true
//         }, function(stream) {
//             videoPreview.src = window.URL.createObjectURL(stream);
//             videoPreview.play();

//             recordVideo = RecordRTC(stream, {
//                 type: 'video',
//                 // recorderType: !!navigator.mozGetUserMedia ? MediaStreamRecorder : WhammyRecorder
//             });

//             recordVideo.startRecording();
//         }, function(error) { throw error;});
//     document.querySelector('#stop-recording-video').disabled = false;
// };

// document.querySelector('#stop-recording-video').onclick = function() {
//     this.disabled = true;

//     recordVideo.stopRecording(function(url) {
//         videoPreview.src = url;
//         videoPreview.download = videoFile;

        // log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file download started. It is about 18MB in size; please be patient!');
//         convertStreams(recordVideo.getBlob());
//     });
// };

var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';

if(document.domain == 'localhost') {
  workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
}

function processInWebWorker() {
    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
        type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    URL.revokeObjectURL(blob);
    return worker;
}

var worker;

export function convertStreams(videoBlob) {
  console.log('converting streams')
    var aab;
    var buffersReady;
    var workerReady;
    var posted;

    var fileReader = new FileReader();
    fileReader.onload = function() {
      console.log('fileREader loaded')
        aab = this.result;
        console.log(this.result)
        console.log(videoBlob)
    };
    console.log(fileReader.readAsArrayBuffer(videoBlob))

    // var postMessage = function() {
    //     posted = true;

    //     worker.postMessage({
    //         type: 'command',
    //         arguments: [
    //             '-i', videoFile,
    //             '-c:v', 'mpeg4',
    //             '-b:v', '6400k',
    //             '-strict', 'experimental', 'output.mp4'
    //         ],
    //         files: [
    //             {
    //                 data: new Uint8Array(aab),
    //                 name: videoFile
    //             }
    //         ]
    //     });
    // };
}

export function PostBlob(blob) {
  console.log('postblob called')
    var video = document.createElement('video2');
    video.controls = true;

    var source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    source.type = 'video/mp4; codecs=mpeg4';
    video.appendChild(source);

    video.download = 'Play mp4 in VLC Player.mp4';

    inner.appendChild(document.createElement('hr'));
    var h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4" style="font-size:200%;color:red;">Download Converted mp4 and play in VLC player!</a>';
    inner.appendChild(h2);
    h2.style.display = 'block';
    inner.appendChild(video);

    video.tabIndex = 0;
    video.focus();
    video.play();
}


