# cuspid

intense visualizations - infiltrationlab style.

![alt text](https://raw.githubusercontent.com/breedx2/cuspid/master/static/cuspid.jpg "cuspid")

# huh?

cuspid is a visualization tool that displays images and videos in various modes of manipulation.  It is inspired by microscopy and the aesthetics of found/accidental texture.

It is aimed at being used as backing material for non/musical performance, and other uses may be discovered.

# running it

cuspid is mostly intended to be hosted, but if you want to run it for development or exploration:

```
$ git clone git@github.com:breedx2/cuspid.git
$ cd cuspid
$ npm install
$ npm start
```

Then point a browser to http://localhost:8080/workspace

# keys

* n - change image
* + - increase animation speed
* - - decrease animation speed
* ⟵ - scroll left
* shift ⟵ - pallete scroll down
* ctrl ⟵ - decrease animation delta x
* → - scroll right
* shift →  palette scroll up
* ctrl → - increase animation delta x
* ↑ - scroll up
* shift ↑ - zoom in animation mode
* ctrl ↑ - decrease animation delta y
* ↓ - scroll down
* shift ↓ - zoom out animation mode
* ctrl ↓ - increase animation delta y  
* z - zoom out (when in scrolling mode)
* shift z - zoom in (when in scrolling mode)
* f - toggle fps overlay
* i - toggle interpolation mode

# OSC

[OSC (Open Sound Control)](http://opensoundcontrol.org/) is lightweight protocol for sending control messages between pieces of musical instrumentation.

In addition to the above keystrokes, cuspid allows the web client to be controlled by remote OSC messages.  When a web client connects to the cuspid server, it registers with an id.  This id can be used by the OSC sender to uniquely address a single or group of web clients.

```
              osc/udp                  ws
  controller ---------> cuspid server -------> cuspid webclient
```

## messages

See [ws-events.js](../master/src/ws-events.js) for gory details.

In these examples `{id}` is the client id being addressed.

| address                   | arg(s)       | notes        |
| ------------------------- |--------------| -------------|
| /{id}/mode                | {modename}   | modename can be `up`, `down`, `left`, `right`, `zoomIn`, `zoomOut`, `paletteUp`, `paletteDown`, `imageSequence`    
| /{id}/togglePause         |              | toggles play/stop
| /{id}/pause               | 0, 1         | 0 = pause, 1 = play             
| /{id}/nextImage           |              | shows next image, only valid in certain modes
| /{id}/toggleInterpolation |              | toggles smooth pixel interpolation
| /{id}/toggleFps           |              | toggles on-screen framerate display
| /{id}/toggleDotPass       |              | toggles dot-screen effect.  
| /{id}/dotPass             | 0, 1         | 0 = disable effect, 1 = enable effect
| /{id}/dotScale            | {scale}      | sets the dot scale factor to a specific value
| /{id}/deltaDotScale       | {delta}      | adjusts the dot scale factor by a certain amount
| /{id}/toggleGlitchPass    |              | toggles the glitch pass effect
| /{id}/glitchPass          | 0, 1         | 0 = disable glitch effect, 1 = enable glitch effect
| /{id}/speedUp             | {num}        | speed up by {num} amount
| /{id}/slowDown            | {num}        | slow down by  {num} amount
| /{id}/speed               | {speed}      | set speed value to specific value
| /{id}/zoom                | {zoom}       | set zoom to specific value range, min = 1
| /{id}/nudgeLeft           | {num}        | when zoomed, nudge image left by {num} amount.  only valid in some display modes.
| /{id}/nudgeRight          | {num}        | when zoomed, nudge image right by {num} amount.  only valid in some display modes.
| /{id}/nudgeUp             | {num}        | when zoomed, nudge image up by {num} amount.  only valid in some display modes.
| /{id}/nudgeDown           | {num}        | when zoomed, nudge image down by {num} amount.  only valid in some display modes.

# Pd

Pd or PureData is a graphical language for doing sound/media work.  There's a very small amount of support for sending OSC from Pd.  See [the pd/ dir](../master/src/pd) for details.
