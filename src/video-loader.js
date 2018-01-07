'use strict';

const cache = {};

class VideoLoader {
  static load(url) {
    return new Promise((fulfill, reject) => {
      if (cache[url]) {
        console.log(`Video ${url} loaded from cache!`);
        return fulfill(cache[url]);
      }
      const video = newVideo(url);
      video.onplaying = function() {
        console.log("Video loaded!");
        cache[url] = video;
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
