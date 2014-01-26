var step = 1;

function tutorial() {
  var lStep = "Step", lBack = "Back", lNext = "Next", lClose = "Close";
  var tutorialCover, tutorialContent, tutorialOverlay, back, next, tutorialText, stepCount, currentStep;

  var steps = document.querySelectorAll('*[data-tutorial]').length;
  if (steps == 0) return;
  createTutorialElements();
  changeStep();

  function createTutorialElements() {
    if (tutorialCover) return;

    tutorialCover = document.createElement("div");
    tutorialCover.className = "tutorial-cover";

    tutorialContent = document.createElement("div");
    tutorialContent.className = "tutorial-content";

    tutorialOverlay = document.createElement("div");
    tutorialOverlay.className = "tutorial-overlay";
    tutorialOverlay.onclick = closeTutorial;

    back = document.createElement("button");
    back.className = "tutorial-back";
    back.innerHTML = lBack;
    
    next = document.createElement("button");
    next.className = "tutorial-next";
    next.innerHTML = lNext;

    var close = document.createElement("button");
    close.className = "tutorial-close";
    close.onclick = tutorialOverlay.onclick;
    close.innerHTML = "×";
    close.title = lClose;

    tutorialText = document.createElement("div");
    tutorialText.className = "tutorial-text";

    stepCount = document.createElement("div");
    stepCount.className = "tutorial-step";

    tutorialContent.appendChild(close);
    tutorialContent.appendChild(tutorialText);
    tutorialContent.appendChild(back);
    tutorialContent.appendChild(stepCount);
    tutorialContent.appendChild(next);

    tutorialCover.appendChild(tutorialOverlay);
    tutorialCover.appendChild(tutorialContent);

    document.body.appendChild(tutorialCover);
  }

  function changeStep() {
    currentStep = document.querySelector('*[data-tutorial-step="' + step + '"]');
      
    tutorialText.innerHTML = currentStep.getAttribute('data-tutorial');
    highlight();

    back.style.display = (step == 1) ? "none" : "block";
    next.innerHTML = (step == steps) ? lClose : lNext;
    stepCount.innerHTML = lStep + " " + step + " / " + steps;


    back.onclick = function() {
      step--;
      changeStep();
    }

    next.onclick = function() {
      if (step == steps) {
        closeTutorial();
        return;
      }
      step++;
      changeStep();
    }
  }

  function clearHighlight() {
    var hlElement = document.querySelector('.tutorial-highlight');
    if (hlElement) hlElement.className = hlElement.className.replace(' tutorial-highlight', '');
  }

  function highlight() {
    clearHighlight();
    var el = currentStep;
    tutorialCover.style.display = "block";

    if (getStyle(el, "position") == "static") {
      el.style.position = "relative";
    }

    var clientRect = el.getBoundingClientRect();
    var top = clientRect.top + (document.documentElement.scrollTop || document.body.scrollTop);
    var left = clientRect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);

    var space = 20;
    var screenWidth = document.documentElement.clientWidth;
    tutorialContent.className = "tutorial-content";

    // Scroll up/down if element is out of viewport
    if (top < (document.documentElement.scrollTop || document.body.scrollTop) || top + tutorialContent.offsetHeight > ((document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight)) {
      window.scrollTo(0, top - space);
    }

    if (left < tutorialContent.offsetWidth && (screenWidth - (left + el.offsetWidth)) < tutorialContent.offsetWidth) {
      tutorialContent.style.left = left + "px";
      tutorialContent.style.top = top + el.offsetHeight + space + "px";
      tutorialContent.className += " tutorial-up";

    }
    else if (left > tutorialContent.offsetWidth) {
      tutorialContent.style.left = left - tutorialContent.offsetWidth - space + "px";
      tutorialContent.style.top = top + "px";
      tutorialContent.className += " tutorial-right";
    }
    else {
      tutorialContent.style.left = left + el.offsetWidth + space + "px";
      tutorialContent.style.top = top + "px";
      tutorialContent.className += " tutorial-left";
    }
   
    el.className += " tutorial-highlight";
  }

  function closeTutorial() {
    tutorialCover.style.display = "none";
    clearHighlight();
  }

  window.onresize = function() {
    if (tutorialCover && tutorialCover.style.display != "none") {
      highlight();
    }
  }

  function getStyle(oElm, strCssRule) {
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
        return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
  }
}

function createTutorial(items) {
  window.onload = addItems;
  
  function addItems() {
    var i = 1;
    for (item in items) {
      items[item].setAttribute("data-tutorial-step", i);
      items[item].setAttribute("data-tutorial", item);
      i++;
    }
  }
}