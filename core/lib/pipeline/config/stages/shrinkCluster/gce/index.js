'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.core.pipeline.stage.gce.shrinkClusterStage', [
  require('utils'),
  require('./shrinkClusterExecutionDetails.controller.js')
])
  .config(function(pipelineConfigProvider) {
    pipelineConfigProvider.registerStage({
      provides: 'shrinkCluster',
      cloudProvider: 'gce',
      templateUrl: require('./shrinkClusterStage.html'),
      executionDetailsUrl: require('./shrinkClusterExecutionDetails.html'),
      validators: [
        { type: 'requiredField', fieldName: 'cluster' },
        { type: 'requiredField', fieldName: 'shrinkToSize', fieldLabel: 'shrink to [X] Server Groups'},
        { type: 'requiredField', fieldName: 'zones', },
        { type: 'requiredField', fieldName: 'credentials', fieldLabel: 'account'},
      ],
    });
  }).controller('gceShrinkClusterStageCtrl', function($scope, accountService, stageConstants, _) {
    var ctrl = this;

    let stage = $scope.stage;

    $scope.state = {
      accounts: false,
      zonesLoaded: false
    };

    accountService.listAccounts('gce').then(function (accounts) {
      $scope.accounts = accounts;
      $scope.state.accounts = true;
    });

    $scope.zones = ['us-central1-a', 'us-central1-b', 'us-central1-c'];

    ctrl.accountUpdated = function() {
      accountService.getRegionsForAccount(stage.credentials).then(function(regions) {
        $scope.zones = _.flatten(_.map(regions, (zones) => { return zones; } ));
        $scope.zonesLoaded = true;
      });
    };

    stage.zones = stage.zones || [];
    stage.cloudProvider = 'gce';

    if (!stage.credentials && $scope.application.defaultCredentials) {
      stage.credentials = $scope.application.defaultCredentials;
    }
    if (!stage.zones.length && $scope.application.defaultRegion) {
      stage.zones.push($scope.application.defaultRegion);
    }

    if (stage.credentials) {
      ctrl.accountUpdated();
    }

    if (stage.shrinkToSize === undefined) {
      stage.shrinkToSize = 1;
    }

    if (stage.allowDeleteActive === undefined) {
      stage.allowDeleteActive = false;
    }

    ctrl.pluralize = function(str, val) {
      if (val === 1) {
        return str;
      }
      return str + 's';
    };

    if (stage.retainLargerOverNewer === undefined) {
      stage.retainLargerOverNewer = "false";
    }
    stage.retainLargerOverNewer = stage.retainLargerOverNewer.toString();

    $scope.$watch('stage.credentials', $scope.accountUpdated);
  });

