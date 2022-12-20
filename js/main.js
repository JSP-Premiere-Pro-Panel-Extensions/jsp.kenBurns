JSP.assignDrawerToButton('grow-drawer','grow')
JSP.assignDrawerToButton('shrink-drawer','shrink')
JSP.makeDrawersExclusive(['grow-drawer','shrink-drawer'])

// #apply-grow <button> click
document.getElementById('apply-grow').addEventListener('click', () => {
  var scale = { rate:     document.getElementById('grow-rate').value,
                initial:  document.getElementById('grow-initial').value,
                final:    document.getElementById('grow-final').value }
  if  (!scale.rate)         {document.getElementById('grow-rate-checkbox').checked = false}
  if  (!scale.initial)      {document.getElementById('grow-initial-checkbox').checked = false}
  if  (!scale.final)        {document.getElementById('grow-final-checkbox').checked = false}
  if  (document.getElementById('grow-initial-checkbox').checked && 
       document.getElementById('grow-final-checkbox').checked)     
                            {document.getElementById('grow-rate-checkbox').checked = false}
  JSP.refresh()
  if  (!document.getElementById('grow-rate-checkbox').checked)        { scale.rate = '' }
  if  (!document.getElementById('grow-initial-checkbox').checked)     { scale.initial = '' }
  if  (!document.getElementById('grow-final-checkbox').checked)       { scale.final = '' }
  CS.evalScript('applyScaleToSelection('+JSON.stringify(scale)+')')
})

// #apply-shrink <button> click
document.getElementById('apply-shrink').addEventListener('click', () => {
  var scale = { rate:     '-' + document.getElementById('shrink-rate').value,
                initial:  document.getElementById('shrink-initial').value,
                final:    document.getElementById('shrink-final').value }
  if  (scale.rate === '-')  {document.getElementById('shrink-rate-checkbox').checked = false}
  if  (!scale.initial)      {document.getElementById('shrink-initial-checkbox').checked = false}
  if  (!scale.final)        {document.getElementById('shrink-final-checkbox').checked = false}
  if  (document.getElementById('shrink-initial-checkbox').checked && 
       document.getElementById('shrink-final-checkbox').checked)     
                            {document.getElementById('shrink-rate-checkbox').checked = false}
  JSP.refresh()
  if  (!document.getElementById('shrink-rate-checkbox').checked)      { scale.rate = '' }
  if  (!document.getElementById('shrink-initial-checkbox').checked)   { scale.initial = '' }
  if  (!document.getElementById('shrink-final-checkbox').checked)     { scale.final = '' }
  CS.evalScript('applyScaleToSelection('+JSON.stringify(scale)+')')
})