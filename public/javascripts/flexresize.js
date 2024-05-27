const wr1 = document.querySelector('.wr1');
const wr2 = document.querySelector('.wr2');
const wr3 = document.querySelector('.wr3');
const wr4 = document.querySelector('.wr4');
const wr5 = document.querySelector('.wr5');

const rows = [wr1, wr2, wr3, wr4, wr5];

const bc1A = document.querySelector('.bc1A');

const bc2A = document.querySelector('.bc2A');
const bc2B = document.querySelector('.bc2B');
const bc2C = document.querySelector('.bc2C');
const bc2D = document.querySelector('.bc2D');
const bc2E = document.querySelector('.bc2E')

const bc3A = document.querySelector('.bc3A');
const bc3B = document.querySelector('.bc3B');

const cols = [bc1A, bc2A, bc2B, bc2C, bc2D, bc3A, bc3B];

const handle1 = document.querySelector('.handle1');
const handle2 = document.querySelector('.handle2');
const handle3 = document.querySelector('.handle3');
const handle4 = document.querySelector('.handle4');

const handlers = [handle1, handle2, handle3, handle4];
const handlerDragging = [false, false, false, false];

document.addEventListener('mousedown', function(e) {
  // If mousedown event is fired from .handler, toggle flag to true
    handlers.forEach((handler, i) => {
        if (e.target === handler) {
            handlerDragging[i] = true;
        }
    });
    console.log('MOUSEDOWN' + handlerDragging);
});

document.addEventListener('mousemove', function(e) {
  // Don't do anything if dragging flag is false
  handlers.forEach((handler, i) => {
    if (!handlerDragging[i]) {
      return false;
    } else {
        var closestWrapper = handlers[i].closest('.row');
        console.log('closestWrapper' + closestWrapper.classList);

        if(handlers[i] === handle1) {
            var closestMoveCol = document.querySelector('.bc2A');
        } else if(handlers[i] === handle2) {
            var closestMoveCol = document.querySelector('.bc2B');
        } else if(handlers[i] === handle3) {
            var closestMoveCol = document.querySelector('.bc2C');
        } else if(handlers[i] === handle4) {
            var closestMoveCol = document.querySelector('.bc2D')
        }
        console.log('closestMoveCol' + closestMoveCol);

        // Get the width of movecol
        var wrapperOffsetLeft = closestMoveCol.offsetLeft;

        // Get the x-coordinate of pointer relative to the movecol
        var pointerRelativeXpos = e.clientX - wrapperOffsetLeft;

        // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
        var minWidth = 1;

        // Resize box A
        // * 8px is the left/right spacing between .handler and its inner pseudo-element
        // * Set flex-grow to 0 to prevent it from growing
        console.log('wrapperOffsetLeft: ' + wrapperOffsetLeft);
        console.log('pointerRelativeXpos: '   + pointerRelativeXpos);
        console.log('set width of: ' + closestMoveCol.classList  + ' to ' + (Math.max(minWidth, pointerRelativeXpos)-4) + 'px');
        closestMoveCol.style.width = (Math.max(minWidth, pointerRelativeXpos - 8)) + 'px';
        closestMoveCol.style.maxWidth = (Math.max(minWidth, pointerRelativeXpos - 8)) + 'px';
        closestMoveCol.style.flexGrow = 0;
        closestMoveCol.style.flex = 'auto';
    }
  });
});

document.addEventListener('mouseup', function(e) {
  // Turn off dragging flag when user mouse is up
  for(var i = 0; i < handlers.length; i++) {
    handlerDragging[i] = false;
  }
});
