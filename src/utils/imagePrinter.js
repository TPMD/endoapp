import moment from 'moment'
function ImagePrinter(images, patientInfo) {
  var i = 0;
  var end = images.length;
  this.images = images
  this.initOptions()
  this.windowContent = "<!DOCTYPE html>"
  this.windowContent += '<html>'
  this.windowContent += '<head><title>Print canvas</title></head>';
  this.windowContent += '<body>'
  this.patientInfo = patientInfo
}
ImagePrinter.prototype = {
  
  images : null,
  options : null,
  window : null,

  
  initOptions : function() {
    this.options = [
      "scrollbars=yes",
      "toolbar=yes"
    ];
  },
  
  closeWindow : function() {
    if (this.window && this.window.close) {
      this.window.close();
      this.window = null;
    }
  },
  
  getImagesSource : function() {
    var i = 0;
    var end = this.images.length;
    var src = "";
    
    while (i < end) {
      src += '<img src="'+this.images[i]+'" width="200" style="border-radius:0px; padding-left:10px; margin-bottom:20px;">';
      i++;
    }
    return src;
  },

  getPatientInfo: function() {
    console.log('getting patient info')
    let html = ''
    html += '<div class="patient-info"'
    html += '<p> Patient Name: ' + this.patientInfo.Patient_Name + '</p>'
    html += '<p> Patient Id: ' + this.patientInfo.Patient_Id + '</p>'
    html += '<p> Exam Date: ' + moment.utc(Number(this.patientInfo.Patient_Date)).format('YYYY-MM-DD') + '</p>'
    html += '</div>'
    html += '<div class="physician-info">'
    html += '<p> Attending Physician: ' + this.patientInfo.Patient_Doctor + '</p>'
    html += '</div>'
    return html
  },
  
  getOptions : function() {
    return this.options.join(",");
  },
  
  openWindow : function() {
    if (!this.window) {
      this.window = window.open("", "_blank", this.getOptions() );
      this.window.document.write(this.windowContent)
      this.window.focus()
    }
    this.window.focus();
  },
  
  print : function() {
    if (this.window) {
      this.closeWindow();
    }
    this.openWindow();
    this.window.document.write(this.getPatientInfo());
    this.window.document.write( this.getImagesSource());
    this.window.document.write('</body>')
    this.window.document.write('</html>')
    this.window.document.close();
    setTimeout(() => {
      this.window.focus();
      this.window.print();
      this.window.close();
    }, 250);
  }
  
};

export default ImagePrinter