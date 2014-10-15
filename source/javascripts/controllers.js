/******************************************************************************
*** CAROUSELCONTROLLER 
*** Author:    Anton Agana
***
*** Moves the carousel automatically and Responds to user input on carousels. 
*** Valid input are as follows:
***  - Left Navigation
***  - Right Navigation
***  - Download Button
***  - Pause/unpause Button
*** 
******************************************************************************/

var CAROUSELCONTROLLER = (function(globals, prev) {
  'use strict';
  // Dependencies and Imports
  var HELPERFUNCTIONS = globals.HELPERFUNCTIONS || {};
  // Exports
  var CAROUSELCONTROLLER = prev || {};
  CAROUSELCONTROLLER.stopCarousel = stopCarousel;
  CAROUSELCONTROLLER.autoMove = autoMove;
  CAROUSELCONTROLLER.moveCarouselByStep = moveCarouselByStep;
  CAROUSELCONTROLLER.downloadVisiblePhotoHandler = downloadVisiblePhotoHandler;
  CAROUSELCONTROLLER.pauseButtonHandler = pauseButtonHandler;
   

  function stopCarousel(carousel) {
    clearInterval(carousel.dataset.intervId);
    carousel.dataset.intervId = '';
  }

  function autoMove(carousel) {
    var step = Number(carousel.dataset.autoStep), 
      time = Number(carousel.dataset.time),
      intervId = setInterval( function() { 
        moveCarouselByStep(carousel, step); }, 
        time);
    carousel.dataset.intervId = intervId;
  }


  function moveCarouselByStep(carousel, step) {
    var filmstrip = HELPERFUNCTIONS.getChildWithClassName(
                      HELPERFUNCTIONS.getChildWithClassName(carousel, 'viewport'), 'filmstrip'),
      marginLeft = Number(filmstrip.style.marginLeft.replace('px', '')),
      filmstripWidth = Number(filmstrip.dataset.totalWidth);

    marginLeft += step;
    if ( Math.abs(marginLeft) === filmstripWidth) {
      marginLeft = 0;
    } else if (marginLeft > 0) {
      marginLeft = -(filmstripWidth - step);
    }

    filmstrip.style.marginLeft = marginLeft + 'px';
    carousel.dataset.autoStep = step;
  }


  // Downloads current visible photo on the carousel.
  function downloadVisiblePhotoHandler (carousel, downloadLink) {
    var filmstrip = HELPERFUNCTIONS.getChildWithClassName(
                      HELPERFUNCTIONS. getChildWithClassName(carousel, 'viewport'), 'filmstrip'),
      marginLeft = Number(filmstrip.style.marginLeft.replace('px', '')),
      carouselWidth = Number(carousel.dataset.viewingWidth),
      index = Math.abs(marginLeft/carouselWidth),
      img = filmstrip.children[index].firstChild;

    downloadLink.download = img.alt.trim().split(' ').join('_').split('\"').join('').split('\'').join('');
    downloadLink.href = img.src;
  }

  function pauseButtonHandler (carousel) {
    if(carousel.dataset.intervId) { // if truthy
      stopCarousel(carousel);
    } else {
      autoMove(carousel);
    }
  }

  return CAROUSELCONTROLLER;
})(this, CAROUSELCONTROLLER);

