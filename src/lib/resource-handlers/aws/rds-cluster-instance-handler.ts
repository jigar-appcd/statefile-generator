import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSRDSClusterInstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const clusterId = generateResourceId('cluster')
    const instanceId = generateResourceId('instance')
    
    const attributes: ResourceAttributes = {
      identifier: `${resourceName}-${instanceId}`,
      cluster_identifier: `${resourceName}-${clusterId}`,
      instance_class: 'db.serverless',
      engine: 'aurora-postgresql',
      engine_version: '15.3',
      db_parameter_group_name: `${resourceName}-${instanceId}-param-group`,
      monitoring_interval: 60,
      auto_minor_version_upgrade: true,
      performance_insights_enabled: true,
      performance_insights_retention_period: 7,
      copy_tags_to_snapshot: true,
      publicly_accessible: false,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_rds_cluster.${clusterId}`,
        `aws_db_parameter_group.${resourceName}-${instanceId}-param-group`
      ]
    }

    return attributes
  }
} 