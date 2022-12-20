#include jspScriptSupport.jsx
#include ../js/lib/json2.js

function applyScaleToSelection (scale) {
  var clips = getSelectedVideoClips()
  if (clips) {
    for (i=0; i<clips.length; i++) {
      applyScale(clips[i],scale)
    }
  }
  return true
}

function getSelectedVideoClips () {
  var selectedVideoClips = []
  var seq = app.project.activeSequence
  if (seq) {
    var selection = seq.getSelection()
    for (i=0; i<selection.length; i++) {
        if (selection[i].mediaType === 'Video') {
          selectedVideoClips.push(selection[i])
        }
      }
  }
  return selectedVideoClips
}

function applyScale (clip, scale) {
  var r  = parseFloat(scale.rate)       // percent per second
  var si = parseFloat(scale.initial)    // initial scale (%)
  var sf = parseFloat(scale.final)      // final scale (%)
  var ti = clip.inPoint.seconds         // initial time (s)
  var tf = clip.outPoint.seconds        // final time (s)
  var td = clip.duration.seconds        // duration (s)
  var min = 0                           // minimum scale value permitted (%)
  var max = 10000                       // maximum scale value permitted (%)
  var scaleProperty = clip.components[1].properties[1]
  scaleProperty.setTimeVarying(false)   // removes existing keys
  // calculate rate, if given initial and final scales
  if ( !isNaN( si ) && !isNaN( sf ) ) { r = (sf-si) / td }
  // if rate is unknown or zero
  if ( ! r ) {
    if        ( !isNaN( si ) )    { scaleProperty.setValue(si,1) }
    else if   ( !isNaN( sf ) )    { scaleProperty.setValue(sf,1) }
    else                          { scaleProperty.setValue(100,1) }
  }
  // if rate is non-zero
  else {
    if        ( !isNaN( si ) )    { sf = si + (r*td) }    
    else if   ( !isNaN( sf ) )    { si = sf - (r*td) }
    else                          { si = r < 0 ? 100 - (r*td) : 100
                                    sf = r < 0 ? 100 : 100 + (r*td) }
    var tmax = ti + ( (max-si) / r )    // time at which max value reached (s)
    var tmin = ti + ( (min-si) / r )    // time at which min value reached (s)
    scaleProperty.setTimeVarying(true)  // enables keyframes
    // add max key, if in time range
    if (tmax >= ti && tmax <= tf) {
      scaleProperty.addKey(tmax)
      scaleProperty.setValueAtKey(tmax,max,1)
    }
    // add min key, if in time range
    if (tmin >= ti && tmin <= tf) {
      scaleProperty.addKey(tmin)
      scaleProperty.setValueAtKey(tmin,min,1)
    }
    // add initial key, if in value range
    if (si >= min && si <= max) {
      scaleProperty.addKey(ti)
      scaleProperty.setValueAtKey(ti,si,1)
    }
    // add final key, if in value range
    if (sf >= min && sf <= max) {
      scaleProperty.addKey(tf)
      scaleProperty.setValueAtKey(tf,sf,1)
    }
  }
  return true
}