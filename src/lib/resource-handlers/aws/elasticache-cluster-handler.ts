import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateElastiCacheClusterId,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSElastiCacheClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const clusterId = generateElastiCacheClusterId()
    const sgId = generateSecurityGroupId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    
    const attributes: ResourceAttributes = {
      cluster_id: `${resourceName}-${clusterId}`,
      engine: 'redis',
      engine_version: '7.0',
      node_type: 'cache.t3.micro',
      num_cache_nodes: 1,
      parameter_group_name: `${resourceName}-param-group`,
      port: 6379,
      security_group_ids: [sgId],
      subnet_group_name: `${resourceName}-subnet-group`,
      snapshot_retention_limit: 7,
      snapshot_window: '03:00-04:00',
      maintenance_window: 'Mon:04:00-Mon:05:00',
      auto_minor_version_upgrade: true,
      notification_topic_arn: null,
      az_mode: 'single-az',
      preferred_availability_zone: 'us-west-2a',
      ip_discovery: 'ipv4',
      network_type: 'ipv4',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_elasticache_subnet_group.${resourceName}-subnet-group`,
        `aws_elasticache_parameter_group.${resourceName}-param-group`
      ]
    }

    return attributes
  }
} 