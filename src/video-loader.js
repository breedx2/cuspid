'use strict';

class VideoLoader {
  static load(url) {
    return new Promise((fulfill, reject) => {
      const video = newVideo(url);
      video.onplaying = function() {
        console.log("Video loaded!");
        fulfill(video);
      };
    });
  }
}

function newVideo(url) {
  const video = document.createElement("video");
  video.autoplay = true;
  video.loop = true;
  //TODO: Don't hard code these!
  video.width = 640;
  video.height = 360;
  video.muted = true;
  video.src = url;
  video.url = url;
  video.setAttribute('webkit-playsinline', 'webkit-playsinline');
  video.play();
  return video;
}

module.exports = VideoLoader;
