/******************************************************************************
*** HELPERFUNCTIONS 
*** Author:    Anton Agana
***
*** Helper functions.
*** 
******************************************************************************/

var HELPERFUNCTIONS = (function(prev) {
  'use strict';
  // Exports
  var HELPERFUNCTIONS = prev || {};
  HELPERFUNCTIONS.loadJsonViaAjax = loadJsonViaAjax;
  HELPERFUNCTIONS.getChildWithClassName = getChildWithClassName;

  // AJAX
  function loadJsonViaAjax(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) { // request is done
        if (xhr.status === 200) { // successfully
          callback(JSON.parse(xhr.responseText));
        } else {
          console.error(xhr);
        }
      }
    };
    xhr.open("GET", path, true); //false indicates to wait for server response before returning control to JavaScript
    xhr.send();
  }

  // Helper Function to find child with a specific className. Returns last instance.
  function getChildWithClassName (parent, classNameOfChild) {
    for (var i = parent.children.length - 1; i >= 0; i--) { //start at last elem for speed
      if(parent.children[i].className.indexOf(classNameOfChild) > -1) 
        return parent.children[i];
    }
    console.log('ERROR: child not found');
  }

  return HELPERFUNCTIONS;
})(HELPERFUNCTIONS);

