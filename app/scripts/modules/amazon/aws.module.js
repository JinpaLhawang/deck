'use strict';

let angular = require('angular');

require('./logo/aws.logo.less');

// load all templates into the $templateCache
var templates = require.context('./', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

module.exports = angular.module('spinnaker.aws', [
  require('./serverGroup/details/serverGroup.details.module.js'),
  require('./serverGroup/serverGroup.transformer.js'),
  require('./serverGroup/configure/wizard/CloneServerGroup.aws.controller.js'),
  require('./serverGroup/configure/serverGroup.configure.aws.module.js'),
  require('./instance/awsInstanceType.service.js'),
  require('./loadBalancer/loadBalancer.transformer.js'),
  require('./loadBalancer/details/loadBalancerDetail.controller.js'),
  require('./loadBalancer/configure/createLoadBalancer.controller.js'),
  require('./instance/details/instance.details.controller.js'),
  require('./securityGroup/details/securityGroupDetail.controller.js'),
  require('./securityGroup/configure/CreateSecurityGroupCtrl.js'),
  require('./keyPairs/keyPairs.read.service.js'),
  require('./securityGroup/configure/EditSecurityGroupCtrl.js'),
  require('./securityGroup/securityGroup.transformer.js'),
  require('./securityGroup/securityGroup.reader.js'),
  require('./subnet/subnet.module.js'),
  require('./vpc/vpc.module.js'),
  require('./image/image.reader.js'),
  require('./cache/cacheConfigurer.service.js'),
  require('./search/searchResultFormatter.js'),
])
  .config(function(cloudProviderRegistryProvider) {
    cloudProviderRegistryProvider.registerProvider('aws', {
      logo: {
        path: require('./logo/aws.logo.png'),
      },
      cache: {
        configurer: 'awsCacheConfigurer',
      },
      image: {
        reader: 'awsImageReader',
      },
      serverGroup: {
        transformer: 'awsServerGroupTransformer',
        detailsTemplateUrl: require('./serverGroup/details/serverGroupDetails.html'),
        detailsController: 'awsServerGroupDetailsCtrl',
        cloneServerGroupTemplateUrl: require('./serverGroup/configure/wizard/serverGroupWizard.html'),
        cloneServerGroupController: 'awsCloneServerGroupCtrl',
        commandBuilder: 'awsServerGroupCommandBuilder',
        configurationService: 'awsServerGroupConfigurationService',
      },
      instance: {
        instanceTypeService: 'awsInstanceTypeService',
        detailsTemplateUrl: require('./instance/details/instanceDetails.html'),
        detailsController: 'awsInstanceDetailsCtrl',
      },
      loadBalancer: {
        transformer: 'awsLoadBalancerTransformer',
        detailsTemplateUrl: require('./loadBalancer/details/loadBalancerDetail.html'),
        detailsController: 'awsLoadBalancerDetailsCtrl',
        createLoadBalancerTemplateUrl: require('./loadBalancer/configure/createLoadBalancer.html'),
        createLoadBalancerController: 'awsCreateLoadBalancerCtrl',
      },
      securityGroup: {
        transformer: 'awsSecurityGroupTransformer',
        reader: 'awsSecurityGroupReader',
        detailsTemplateUrl: require('./securityGroup/details/securityGroupDetail.html'),
        detailsController: 'awsSecurityGroupDetailsCtrl',
        createSecurityGroupTemplateUrl: require('./securityGroup/configure/createSecurityGroup.html'),
        createSecurityGroupController: 'awsCreateSecurityGroupCtrl',
      },
      search: {
        resultFormatter: 'awsSearchResultFormatter',
      }
    });
  }).name;
