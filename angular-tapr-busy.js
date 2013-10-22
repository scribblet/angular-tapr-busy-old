angular.module('taprBusy',['ajoslin.promise-tracker', "template/angular-tapr-busy/busy.html"]);


angular.module("template/angular-tapr-busy/busy.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/angular-tapr-busy/busy.html",

      "<div class=\"cg-busy-default-wrapper\">"+
          "<div class=\"cg-busy-default-sign\">"+
          "<div class=\"cg-busy-default-spinner\">"+
          "<div class=\"bar1\"><\/div>"+
          "<div class=\"bar2\"><\/div>"+
          "<div class=\"bar3\"><\/div>"+
          "<div class=\"bar4\"><\/div>"+
          "<div class=\"bar5\"><\/div>"+
          "<div class=\"bar6\"><\/div>"+
          "<div class=\"bar7\"><\/div>"+
          "<div class=\"bar8\"><\/div>"+
          "<div class=\"bar9\"><\/div>"+
          "<div class=\"bar10\"><\/div>"+
          "<div class=\"bar11\"><\/div>"+
          "<div class=\"bar12\"><\/div>"+
          "<\/div>"+
          "<div class=\"cg-busy-default-text\">Please Wait...<\/div>"+
          "<\/div>"+
          "<\/div>");
}]);

angular.module('taprBusy').value('taprBusyTemplateName','template/angular-busy/angular-busy.html');

angular.module('taprBusy').directive('taprBusy',['promiseTracker','$compile','$templateCache','taprBusyTemplateName','$http',
  function(promiseTracker,$compile,$templateCache,taprBusyTemplateName,$http){
    return {
      restrict: 'A',
      link: function(scope, element, attrs, fn) {

        var options = scope.$eval(attrs.taprBusy);

        if (typeof options === 'string'){
          options = {tracker:options};
        }

        if (typeof options === 'undefined' || typeof options.tracker === 'undefined'){
          throw new Error('Options for taprBusy directive must be provided (tracker option is required).');
        }

        if (!scope.$taprBusyTracker){
          scope.$taprBusyTracker = {};
        }
        console.log('getting tracker');
        scope.$taprBusyTracker[options.tracker] = promiseTracker(options.tracker);

        var position = element.css('position');
        if (position === 'static' || position === '' || typeof position === 'undefined'){
          element.css('position','relative');
        }

        var indicatorTemplateName = options.template ? options.template : taprBusyTemplateName;
        console.log(indicatorTemplateName);
        $http.get(indicatorTemplateName,{cache: $templateCache}).success(function(indicatorTemplate){
          options.backdrop = typeof options.backdrop === 'undefined' ? true : options.backdrop;
          var backdrop = options.backdrop ? '<div class="tapr-busy tapr-busy-backdrop"></div>' : '';



          var template = '<div class="tapr-busy tapr-busy-animation hide">'+ backdrop + indicatorTemplate+'</div>';
          var templateElement = $compile(template)(scope);

          angular.element(templateElement.children()[options.backdrop?1:0])
              .css('position','absolute')
              .css('top',0)
              .css('left',0)
              .css('right',0)
              .css('bottom',0);

          element.append(templateElement);

          function toBoolean(value) {
            if (value && value.length !== 0) {
              var v = angular.lowercase("" + value);
              value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
            } else {
              value = false;
            }
            return value;
          }


          var first = true;
          scope.$watch('$taprBusyTracker.' + options.tracker + '.active()',function(value){
            console.log('value changed');
            if (first){
              first = false;
              return; //ignore first
            }
            toBoolean(value) ? console.log('removing hide class from template') : console.log('adding hide class from template')
            toBoolean(value) ? templateElement.removeClass('hide') : templateElement.addClass('hide');
          });
        }).error(function(data){
              throw new Error('Template specified for taprBusy ('+options.template+') could not be loaded. ' + data);
            });
      }
    };
  }
]);

