function manageResize(md, sizeProp, posProp) {
    var r = md.target;

    var prev = r.previousElementSibling;
    var next = r.nextElementSibling;
    if (!prev || !next) {
        return;
    }

    md.preventDefault();

    var prevSize = prev[sizeProp];
    var nextSize = next[sizeProp];
    var sumSize = prevSize + nextSize;
    var prevGrow = Number(prev.style.flexGrow);
    var nextGrow = Number(next.style.flexGrow);
    var sumGrow = prevGrow + nextGrow;
    var lastPos = md[posProp];

    function onMouseMove(mm) {
        var pos = mm[posProp];
        var d = pos - lastPos;
        prevSize += d;
        nextSize -= d;
        if (prevSize < 0) {
            nextSize += prevSize;
            pos -= prevSize;
            prevSize = 0;
        }
        if (nextSize < 0) {
            prevSize += nextSize;
            pos += nextSize;
            nextSize = 0;
        }

        var prevGrowNew = sumGrow * (prevSize / sumSize);
        var nextGrowNew = sumGrow * (nextSize / sumSize);

        //Logic to prevent dragging further than 50% of the screen collapsing other flexboes.
        //checks for pinRight and pinLeft classes in prev/next columns.
        if (next.classList.contains("pinLeft")) {
            if (nextGrowNew < 1.5) {
                nextGrowNew = 1.5;
            }
        }

        if (next.classList.contains("pinRight")) {
            if (prevGrowNew < 1) {
                prevGrowNew = 1;
            }
        }

        if (prev.classList.contains("pinLeft")) {
            if (prevGrowNew < 2) {
                prevGrowNew = 2;
            }
        }

        if (!r.classList.contains("excludePrev") && !prevGrowNew < 2) {
            prev.style.flexGrow = prevGrowNew;
        }

        if (!r.classList.contains("excludeNext")) {
            console.log("notExcluded");
            next.style.flexGrow = nextGrowNew;
        }
        lastPos = pos;
    }

    function onMouseUp(mu) {
        // Change cursor to signal a state's change: stop resizing.
        const html = document.querySelector("html");
        html.style.cursor = "default";

        if (posProp === "pageX") {
            r.style.cursor = "ew-resize";
        } else {
            r.style.cursor = "ns-resize";
        }

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
}

function setupResizerEvents() {
    document.body.addEventListener("mousedown", function (md) {
        // Used to avoid cursor's flickering
        const html = document.querySelector("html");

        var target = md.target;
        if (target.nodeType !== 1 || target.tagName !== "FLEX-RESIZER") {
            return;
        }
        var parent = target.parentNode;
        var h = parent.classList.contains("h");
        var v = parent.classList.contains("v");
        if (h && v) {
            return;
        } else if (h) {
            // Change cursor to signal a state's change: begin resizing on H.
            target.style.cursor = "col-resize";
            html.style.cursor = "col-resize"; // avoid cursor's flickering

            // use offsetWidth versus scrollWidth to avoid splitter's jump on resize when content overflow.
            manageResize(md, "offsetWidth", "pageX");
        } else if (v) {
            // Change cursor to signal a state's change: begin resizing on V.
            target.style.cursor = "row-resize";
            html.style.cursor = "row-resize"; // avoid cursor's flickering

            manageResize(md, "offsetHeight", "pageY");
        }
    });
}

function openTab(evt, tabName, tabsClass, tabContentClass) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName(tabContentClass);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all other elements in tablist with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName(tabsClass);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get all elements with class="tabcontent" and hide them
var tabcontent = document.getElementsByClassName("tab1content");
for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
}

// Get all elements with class="tabcontent" and hide them
var tabcontent = document.getElementsByClassName("tab2content");
for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
}

// Get all elements with class="tabcontent" and hide them
var tabcontent = document.getElementsByClassName("tab0content");
for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
}

setupResizerEvents();
