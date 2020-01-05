# cuspid

intense visualizations - infiltrationlab style.

![alt text](https://raw.githubusercontent.com/breedx2/cuspid/master/static/cuspid.jpg "cuspid")

# huh?

cuspid is a visualization tool that displays images and videos in various modes of manipulation.  It is inspired by microscopy and the aesthetics of found/accidental texture.

It is aimed at being used as backing material for non/musical performance, and other uses may be discovered.

The concept is that it might be used something like this:

![diagram](https://github.com/breedx2/cuspid/raw/master/docs/cuspid_topology.png)

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

## animation modes
* ⟵ - scroll left
* → - scroll right
* ↑ - scroll up
* ↓ - scroll down
* shift ↑ - zoom in
* shift ↓ - zoom out
* s - image sequence
* t - tunnel/zoom sequence (in)
* T - tunnel/zoom sequence (out)
* shift ⟵ - pallete scroll down
* shift →  palette scroll up
* b - blend mode

## misc
* SPACE - pause
* \+ - speed up
* \- - slow down
* ctrl ⟵ - nudge left
* ctrl → - nudge right
* ctrl ↑ - nudge up
* ctrl ↓ - nudge down
* z - zoom out (when in scrolling mode)
* shift z - zoom in (when in scrolling mode)
* n - change image
* d - toggle dot effect
* q - decrease dot scale
* w - increase dot scale
* g - toggle glitch effect
* i - toggle interpolation mode
* f - toggle fps overlay
* F - advance a single "frame"
* c - view/change client id
* k|? - show/hide keys help

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
| /{id}/mode                | {modename}   | modename can be `up`, `down`, `left`, `right`, `zoomIn`, `zoomOut`, `paletteUp`, `paletteDown`, `blend`, `imageSequence`, `stillImage`, `zoomSequenceIn`, `zoomSequenceOut`
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
| /{id}/toggleInvert        |              | toggles the invert pass efect
| /{id}/invert              | 0, 1         | 0 = disable invert, 1 = enable invert
| /{id}/speedUp             | {num}        | speed up by {num} amount
| /{id}/slowDown            | {num}        | slow down by  {num} amount
| /{id}/speed               | {speed}      | set speed value to specific value
| /{id}/zoom                | {zoom}       | set zoom to specific value range, min = 1
| /{id}/nudgeLeft           | {num}        | when zoomed, nudge image left by {num} amount.  only valid in some display modes.
| /{id}/nudgeRight          | {num}        | when zoomed, nudge image right by {num} amount.  only valid in some display modes.
| /{id}/nudgeUp             | {num}        | when zoomed, nudge image up by {num} amount.  only valid in some display modes.
| /{id}/nudgeDown           | {num}        | when zoomed, nudge image down by {num} amount.  only valid in some display modes.
| /{id}/bias                | {num}        | when in blend mode, set the bias level to {num}
| /{id}/biasDelta           | {delta}      | when in blend mode, adjust the bias level by {delta}
| /{id}/advanceOneFrame     |              | advances one fake "frame". makes the most sense when paused.

# Pd

Pd or PureData is a graphical language for doing sound/media work.  There's a very small amount of support for sending OSC from Pd.  See [the pd/ dir](../master/pd) for details.
