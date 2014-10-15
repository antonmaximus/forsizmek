/******************************************************************************
*** CAROUSEL 
*** Author:    Anton Agana
***
*** User can call `CAROUSEL.createCarousel` to create carousel-like framework.
*** Input parameter is a single object with values for the following properties:
***
*** divId:     Required. String. ID of the div on the HTML page where carousel 
***              will be created.
*** jsonPath:  Required if flickrTag property is undefined. String. Path to the JSON file.
*** flickrTag: Optional. String. This is the initial tag on querying photos from
***              the Flickr API.
*** tranTime:  Optional. Integer. This is the transition time between 
***              carousel slides. The default is 1800 ms. 
*** width:     Optional. Integer. User can configure carousel width. Default is 400px.
*** height:    Optional. Integer. User can configure carousel height. Default is 300px.
*** bg:        Optional. String. User can configure carousel's background-color. 
***              Default is white.
***
*** Example Usage:
*** var carousel = new CAROUSEL.Carousel({ divId: 'carouselA', jsonPath: './file.json'});
******************************************************************************/

var CAROUSEL = (function(globals, prev) {
  'use strict';
  // Dependencies and Imports
  var HELPERFUNCTIONS = globals.HELPERFUNCTIONS || {};
  var HELPERFUNCTIONSFLICKR = globals.HELPERFUNCTIONSFLICKR || {};
  var CAROUSELCONTROLLER = globals.CAROUSELCONTROLLER || {};
  // Exports
  var CAROUSEL = prev || {};
  CAROUSEL.Carousel = Carousel;
   

  //Class 
  function Carousel (input) {
    // Initialize variables
    this.carousel = document.getElementById(input.divId);
    this.id = input.divId;
    this.images = [];
    this.bg = input.backgroundColor;
    this.options = {
      w: input.width || 400, //width
      h: input.height || 300, //height
      time: Math.abs(input.tranTime) || 1800
    };
    this.options.resolution = this.options.w/this.options.h;
    this.options.viewMode = this.options.w >= this.options.h ? 'landscape' : 'portrait';


    var self = this;

    if(input.flickrTag) { // If truthy 
      HELPERFUNCTIONSFLICKR.handleFlickrRequest(input.flickrTag, function(arr) {
        loadImagesAndNavigation(arr, self);  
      });
    } else {
      HELPERFUNCTIONS.loadJsonViaAjax(input.jsonPath, function(data) { 
        loadImagesAndNavigation(data.items, self);
      });
    }
  }

  // Loads images and listeners to carousel
  function loadImagesAndNavigation(dataArray, obj) {
    // Make copy
    obj.images = dataArray.slice();

    obj.renderImages();
    obj.addNavigation();
  }


  Carousel.prototype.addNavigation = function () {
    var navigation = document.createElement('div'),
      rightChev = document.createElement('div'),
      leftChev = document.createElement('div'),
      download = document.createElement('a'),
      pause = document.createElement('a');

    // Enable CSS classes
    navigation.className = 'navigation';
    rightChev.className = 'chevron rightChev';
    leftChev.className = 'chevron leftChev';
    download.className = 'download';
    pause.className = 'pause';

    rightChev.dataset.step = -(this.options.w);
    leftChev.dataset.step = this.options.w;
    this.carousel.dataset.autoStep = -(this.options.w);
    this.carousel.dataset.time = this.options.time;
    download.download = true;

    navigation.appendChild(leftChev);
    navigation.appendChild(rightChev);
    navigation.appendChild(download);
    navigation.appendChild(pause);

    // 'afterbegin' -- Just inside the element, before its first child.
    this.carousel.insertAdjacentHTML('afterbegin', navigation.outerHTML);   

    // Add listener
    this.carousel.addEventListener("click", carouselClickHandler, false);

    CAROUSELCONTROLLER.autoMove(this.carousel);
  };

  Carousel.prototype.renderImages = function () {
    var viewport = document.createElement('div'),
        filmstrip = document.createElement('ul');

    // Enable CSS classes
    this.carousel.className = 'carousel';
    viewport.className = 'viewport';
    filmstrip.className = 'filmstrip';

    if(this.bg) {
      viewport.style.backgroundColor = this.bg;
    }

    // Carousel and Filmstrip dimensions vary by user input
    this.carousel.style.width = this.options.w + 'px';
    this.carousel.style.height = this.options.h + 'px';
    filmstrip.style.width = (this.options.w * this.images.length) + 'px';

    // Store data attributes for navigation
    filmstrip.dataset.totalWidth = this.options.w * this.images.length; 
    this.carousel.dataset.viewingWidth = this.options.w;

    var self = this; //Because `this` will refer to a different obj in the closure below
    this.images.forEach( function(elem) {
      var li = document.createElement("li"),
        img = document.createElement("img");

      // Store li style
      li.style.width = self.options.w + 'px';

      // Store img attributes and style
      img.src = elem.path;
      img.alt = elem.title;
      img.title = elem.title;
      img.onload = function() {
        if(self.options.viewMode == 'landscape') {
          if (this.height >  self.options.h)  //If img height is taller than viewport height
            this.style.height = '100%'; 
          else 
            this.parentNode.style.lineHeight = self.options.h + 'px';   
        } 
        else { //portrait
          if(this.height >  self.options.h)  //If img height is taller than viewport height
            this.style.height = '100%'; 
          else {
            this.parentNode.style.lineHeight = self.options.h + 'px';   
            if (this.width > self.options.w) // If img is wider than viewport
              this.style.width = '100%'; 
          }
        }
      };

      li.appendChild(img);
      filmstrip.appendChild(li);
    });

    viewport.appendChild(filmstrip);
    this.carousel.appendChild(viewport);   
  };

  // Identifies mouse  click on navigation and download links
  function carouselClickHandler(e) {
    var target =  e.target || e.srcElement; //Firefox doesn't like srcElement
    var className = target.className;

    if(className.indexOf('chevron') > -1) {
      CAROUSELCONTROLLER.moveCarouselByStep(this, Number(target.dataset.step));
      CAROUSELCONTROLLER.stopCarousel(this);
      CAROUSELCONTROLLER.autoMove(this);
    } else if (className.indexOf('download') > -1) {
      // e.preventDefault();
      CAROUSELCONTROLLER.downloadVisiblePhotoHandler(this, target);
    } else if (className.indexOf('pause') > -1) {
      CAROUSELCONTROLLER.pauseButtonHandler(this, target);
    }
  }

  return CAROUSEL;
})(this, CAROUSEL);


