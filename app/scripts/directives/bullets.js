'use strict';

/**
 * @ngdoc directive
 * @name vindexApp.directive:bullets
 * @description
 * # bullets
 */
angular.module('vindexApp')
  .directive('bullets', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        element.focus(function() {
    		if(element.val() === '') {
           		element.val('• ');
        	}
  			// element.focus().val(element.val());
        });

		element.keyup(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);

			if((element.val() == '• ' || element.val() == '') && keycode == '9') {
           		element.val("•");
           		element.val(element.val() + " ");
        	}

		    if(keycode == '13'){
		        element.val(element.val() + '• ');
			}
			var txtval = element.val();
			if(txtval.substr(txtval.length - 1) == '\n'){
				element.val(txtval.substring(0,txtval.length - 1));
			}
		});

      }
    };
  });
