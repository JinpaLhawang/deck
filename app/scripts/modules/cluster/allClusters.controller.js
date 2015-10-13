'use strict';

let angular = require('angular');

module.exports = angular.module('clusters.all', [
  require('../clusterFilter/clusterFilterService.js'),
  require('../clusterFilter/clusterFilterModel.js'),
  require('./clusterPod.directive.js'),
  require('../account/account.module.js'),
  require('../core/cloudProvider/providerSelection/providerSelection.service.js'),
  require('../serverGroups/configure/common/serverGroupCommandBuilder.js'),
  require('../filterModel/filter.tags.directive.js'),
  require('../utils/waypoints/waypointContainer.directive.js'),
  require('angular-ui-bootstrap'),
  require('../core/cloudProvider/cloudProvider.registry.js'),
])
  .controller('AllClustersCtrl', function($scope, app, $modal, providerSelectionService, _, clusterFilterService,
                                          ClusterFilterModel, serverGroupCommandBuilder, cloudProviderRegistry) {

    ClusterFilterModel.activate();

    $scope.sortFilter = ClusterFilterModel.sortFilter;

    function addSearchFields() {
      app.serverGroups.forEach(function(serverGroup) {
        var buildInfo = '';
        if (serverGroup.buildInfo && serverGroup.buildInfo.jenkins) {
          buildInfo = [
              '#' + serverGroup.buildInfo.jenkins.number,
              serverGroup.buildInfo.jenkins.host,
              serverGroup.buildInfo.jenkins.name].join(' ').toLowerCase();
        }
        if (!serverGroup.searchField) {
          serverGroup.searchField = [
            serverGroup.region.toLowerCase(),
            serverGroup.name.toLowerCase(),
            serverGroup.account.toLowerCase(),
            buildInfo,
            _.pluck(serverGroup.loadBalancers, 'name').join(' '),
            _.pluck(serverGroup.instances, 'id').join(' ')
          ].join(' ');
        }
      });
    }

    function updateClusterGroups() {
      ClusterFilterModel.applyParamsToUrl();
      $scope.$evalAsync(function() {
          clusterFilterService.updateClusterGroups(app);
        }
      );

      $scope.groups = ClusterFilterModel.groups;
      $scope.tags = ClusterFilterModel.tags;
    }

    this.clearFilters = function() {
      clusterFilterService.clearFilters();
      updateClusterGroups();
    };

    this.createServerGroup = function createServerGroup() {
      providerSelectionService.selectProvider(app).then(function(selectedProvider) {
        let provider = cloudProviderRegistry.getValue(selectedProvider, 'serverGroup');
        $modal.open({
          templateUrl: provider.cloneServerGroupTemplateUrl,
          controller: `${provider.cloneServerGroupController} as ctrl`,
          resolve: {
            title: function() { return 'Create New Server Group'; },
            application: function() { return app; },
            serverGroup: function() { return null; },
            serverGroupCommand: function() { return serverGroupCommandBuilder.buildNewServerGroupCommand(app, selectedProvider); },
            provider: function() { return selectedProvider; }
          }
        });
      });
    };

    this.updateClusterGroups = _.debounce(updateClusterGroups, 200);

    function autoRefreshHandler() {
      addSearchFields();
      updateClusterGroups();
    }

    autoRefreshHandler();

    app.registerAutoRefreshHandler(autoRefreshHandler, $scope);
  })
  .name;
