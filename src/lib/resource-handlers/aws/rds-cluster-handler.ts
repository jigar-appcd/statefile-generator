import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class RDSClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const clusterId = generateResourceId('cluster')
    const sgId = generateResourceId('sg')
    const subnetId1 = generateResourceId('subnet')
    const subnetId2 = generateResourceId('subnet')
    const kmsKeyId = generateResourceId('key')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      cluster_identifier: `${resourceName}-${clusterId}`,
      engine: 'aurora-postgresql',
      engine_version: '15.3',
      database_name: resourceName.replace(/-/g, '_'),
      master_username: 'dbadmin',
      master_password: `REPLACE_WITH_SECURE_PASSWORD_${resourceName}`,
      storage_encrypted: true,
      kms_key_id: `arn:aws:kms:us-west-2:${accountId}:key/${kmsKeyId}`,
      vpc_security_group_ids: [sgId],
      db_subnet_group_name: `${resourceName}-${clusterId}-subnet-group`,
      db_cluster_parameter_group_name: `${resourceName}-${clusterId}-param-group`,
      backup_retention_period: 7,
      preferred_backup_window: '03:00-04:00',
      preferred_maintenance_window: 'Mon:04:00-Mon:05:00',
      port: 5432,
      enabled_cloudwatch_logs_exports: [
        'postgresql',
        'upgrade'
      ],
      deletion_protection: true,
      skip_final_snapshot: false,
      final_snapshot_identifier: `${resourceName}-${clusterId}-final-snapshot`,
      serverlessv2_scaling_configuration: {
        min_capacity: 0.5,
        max_capacity: 16
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_db_subnet_group.${resourceName}-${clusterId}-subnet-group`,
        `aws_rds_cluster_parameter_group.${resourceName}-${clusterId}-param-group`
      ]
    }

    return attributes
  }
} 