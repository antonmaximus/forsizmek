/******************************************************************************
*** HELPERFUNCTIONSFLICKR 
*** Author:    Anton Agana
***
*** Handles Flickr calls.
*** 
******************************************************************************/

var HELPERFUNCTIONSFLICKR = (function(prev) {
  'use strict';
  // Exports
  var HELPERFUNCTIONSFLICKR = prev || {};
  HELPERFUNCTIONSFLICKR.handleFlickrRequest = handleFlickrRequest;
  HELPERFUNCTIONSFLICKR.jsonFlickrFeedHandler = jsonFlickrFeedHandler;


  var argumentsHolderForFlickrCallback = [];

  // Callback function for JSONP request
  function jsonFlickrFeedHandler(data) {
    var args  = argumentsHolderForFlickrCallback.pop();

    if(data.items.length === 0) { // If Flickr did not return anything, abort update
      var message = 'Your keyword \'' + args[0] + '\' did not match any pic tags on Flickr. ' +
              'Carousel won\'t be created.';
      alert(message);
      return;
    }

    //clean items before creating carousel
    var cleanedItems = data.items.map(function(elem) {
      return { path: elem.media.m.replace('_m.jpg', '_z.jpg'), title: elem.title };
    });

    var callback = args[1];
    callback(cleanedItems);
  }


  function handleFlickrRequest(keyword, args) {
    // Store keyword and callback function for use when JSONP is returned
    argumentsHolderForFlickrCallback.push([keyword, args]);

    // This script loads JSONP
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = 'http://api.flickr.com/services/feeds/photos_public.gne?' + 
      'tags=' + keyword + '+pic+%22&tagmode=any&format=json&jsoncallback=' + 
      'HELPERFUNCTIONSFLICKR.jsonFlickrFeedHandler';  // append callback
    document.body.appendChild(script);
  }


  return HELPERFUNCTIONSFLICKR;
})(HELPERFUNCTIONSFLICKR);
