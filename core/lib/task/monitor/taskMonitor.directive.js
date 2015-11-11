'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.tasks.monitor.directive', [
  require('../../presentation'),
  require('../../modal'),
])
  .directive('taskMonitor', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: require('./taskMonitor.html'),
      scope: {
        taskMonitor: '=monitor'
      }
    };
  }
);
