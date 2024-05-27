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

rows.forEach((row, i) => {
    rows[i].style.flexWrap = 'nowrap';
    rows[i].style.overflow = 'hidden';
});

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
        console.log('--------- MOUSEMOVE ' + handlers[i] + handlerDragging + '------------');
        var closestRow = handlers[i].closest('.row');
        console.log('closestRow: ' + closestRow.classList);

        if(handlers[i] === handle1) {
            var prevCol = document.querySelector('.bc2A');
            var nextCol = document.querySelector('.bc2B');
        } else if(handlers[i] === handle2) {
            var prevCol = document.querySelector('.bc2B');
            var nextCol = document.querySelector('.bc2C');
        } else if(handlers[i] === handle3) {
            var prevCol = document.querySelector('.bc2C');
            var nextCol = document.querySelector('.bc2D');
        } else if(handlers[i] === handle4) {
            var prevCol = document.querySelector('.bc2D')
        }

        // Get the offsetLeft of movecol
        var prevColOffsetLeft = prevCol.offsetLeft;

        var prevColWidth = prevCol.offsetWidth;

        // Get width of nextCol
        var nextColWidth = nextCol.offsetWidth;

        console.log('prevCol '+ prevCol.classList);
        console.log('prevColWidth ' + prevColWidth);
        console.log('nextCol '+ nextCol.classList);
        console.log('nextColWidth ' + nextColWidth);


        // Get the x-coordinate of pointer relative to the movecol
        var pointerRelativeXpos = e.clientX - prevColOffsetLeft;

        // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
        var minWidth = 1;

        // Resize box A
        // * 8px is the left/right spacing between .handler and its inner pseudo-element
        // * Set flex-grow to 0 to prevent it from growing
        //console.log('prevColOffsetLeft: ' + prevColOffsetLeft);
        //console.log('pointerRelativeXpos: '   + pointerRelativeXpos);
        //console.log('set width of: ' + prevCol.classList  + ' to ' + (Math.max(minWidth, pointerRelativeXpos)-4) + 'px');
        prevCol.style.width = (Math.max(minWidth, pointerRelativeXpos - 8)) + 'px';
        prevCol.style.maxWidth = (Math.max(minWidth, pointerRelativeXpos - 8)) + 'px';

        var colDiff = prevColWidth - prevCol.offsetWidth;
        console.log("prevColWidth: " + prevColWidth);
        console.log("prevCol: " + prevColWidth);
        console.log("colDiff: " + colDiff);

        console.log("nextCol: "+ nextCol.classList + " setting nextColWidth: " + nextColWidth + ", colDiff: " + colDiff);
        nextCol.style.width = (nextColWidth + colDiff) + 'px';
        nextCol.style.maxWidth = (nextColWidth + colDiff) + 'px';
        console.log("nextCol.offsetWidth: "+ nextCol.offsetWidth);

        // we need to do some pointer math to determine when you are trying to pull to the right
        // and the column wont go. Try on column one right now. This is because it won't shrink
        // nextCol until prevCol actually moves, which won't happen in this flext container.

        prevCol.style.flexGrow = 0;

    }
  });
});

document.addEventListener('mouseup', function(e) {
  // Turn off dragging flag when user mouse is up
  for(var i = 0; i < handlers.length; i++) {
    handlerDragging[i] = false;
  }
});
