function ImagePrinter(images) {
  var i = 0;
  var end = images.length;
  this.images = images
  this.initOptions()
  this.windowContent = "<!DOCTYPE html>"
  this.windowContent += '<html>'
  this.windowContent += '<head><title>Print canvas</title></head>';
  this.windowContent += '<body>'
}
ImagePrinter.prototype = {
  
  images : null,
  options : null,
  window : null,

  
  initOptions : function() {
    this.options = [
      "width=400",
      "height=400",
      "scrollbars=yes",
      "location=yes",
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
      src += '<img src="'+this.images[i]+'">';
      i++;
    }
    return src;
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
    this.window.document.write( this.getImagesSource() );
    this.window.document.close();
    setTimeout(() => {
      this.window.focus();
      this.window.print();
      this.window.close();
    }, 250);
  }
  
};

export default ImagePrinter