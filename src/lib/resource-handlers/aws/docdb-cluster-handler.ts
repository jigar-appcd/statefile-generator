import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class DocDBClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      cluster_identifier: `${resourceName}-${generateResourceId()}`,
      engine: 'docdb',
      engine_version: '5.0.0',
      master_username: 'admin',
      master_password: `${generateResourceId()}Aa1!`,
      port: 27017,
      db_subnet_group_name: '${aws_docdb_subnet_group.default.name}',
      vpc_security_group_ids: ['${aws_security_group.default.id}'],
      availability_zones: [
        `${region.code}a`,
        `${region.code}b`,
        `${region.code}c`
      ],
      backup_retention_period: 7,
      preferred_backup_window: '02:00-03:00',
      preferred_maintenance_window: 'sun:05:00-sun:06:00',
      skip_final_snapshot: true,
      storage_encrypted: true,
      kms_key_id: null,
      enabled_cloudwatch_logs_exports: [
        'audit',
        'profiler'
      ],
      deletion_protection: true,
      apply_immediately: false,
      auto_minor_version_upgrade: true,
      db_cluster_parameter_group_name: 'default.docdb5.0',
      copy_tags_to_snapshot: true,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_docdb_subnet_group.default',
        'aws_security_group.default'
      ]
    }

    return attributes
  }
} 