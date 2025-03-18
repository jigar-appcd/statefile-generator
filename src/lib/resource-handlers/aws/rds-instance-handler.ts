import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class RDSInstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const instanceId = generateResourceId('rds')
    const sgId = generateResourceId('sg')
    const subnetId1 = generateResourceId('subnet')
    const subnetId2 = generateResourceId('subnet')
    const kmsKeyId = generateResourceId('key')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      identifier: `${resourceName}-${instanceId}`,
      engine: 'postgres',
      engine_version: '15.3',
      instance_class: 'db.t3.micro',
      allocated_storage: 20,
      storage_type: 'gp3',
      storage_encrypted: true,
      kms_key_id: `arn:aws:kms:us-west-2:${accountId}:key/${kmsKeyId}`,
      username: 'dbadmin',
      password: `REPLACE_WITH_SECURE_PASSWORD_${resourceName}`,
      multi_az: false,
      publicly_accessible: false,
      vpc_security_group_ids: [sgId],
      db_subnet_group_name: `${resourceName}-${instanceId}-subnet-group`,
      parameter_group_name: `${resourceName}-${instanceId}-param-group`,
      backup_retention_period: 7,
      backup_window: '03:00-04:00',
      maintenance_window: 'Mon:04:00-Mon:05:00',
      auto_minor_version_upgrade: true,
      deletion_protection: true,
      skip_final_snapshot: false,
      final_snapshot_identifier: `${resourceName}-${instanceId}-final-snapshot`,
      performance_insights_enabled: true,
      performance_insights_retention_period: 7,
      monitoring_interval: 60,
      enabled_cloudwatch_logs_exports: [
        'postgresql',
        'upgrade'
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_db_subnet_group.${resourceName}-${instanceId}-subnet-group`,
        `aws_db_parameter_group.${resourceName}-${instanceId}-param-group`
      ]
    }

    return attributes
  }
} 