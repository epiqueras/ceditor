/* eslint-disable */

window.onload = function() {
  var myVideo = document.getElementById('my-video');
  var myCanvas = document.getElementById('my-canvas');
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;
  var myCanvasContext = myCanvas.getContext('2d');

  window.setInterval(function() {
    myCanvasContext.drawImage(myVideo, 0, 0, window.innerWidth, window.innerHeight);
    var color = myCanvasContext.getImageData(window.innerWidth / 2, window.innerHeight / 4, 1, 1).data;
    console.log(color);
    document.body.style.backgroundColor = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
  }, 10);
};
