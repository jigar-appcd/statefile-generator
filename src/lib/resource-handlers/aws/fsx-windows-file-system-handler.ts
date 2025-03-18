import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class FSxWindowsFileSystemHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      storage_capacity: 300,
      subnet_ids: ['${aws_subnet.main.id}'],
      throughput_capacity: 128,
      deployment_type: 'MULTI_AZ_1',
      storage_type: 'SSD',
      preferred_subnet_id: '${aws_subnet.main.id}',
      automatic_backup_retention_days: 7,
      copy_tags_to_backups: true,
      daily_automatic_backup_start_time: '01:00',
      kms_key_id: null,
      security_group_ids: ['${aws_security_group.default.id}'],
      skip_final_backup: true,
      weekly_maintenance_start_time: '2:01:00',
      aliases: [`${resourceName.toLowerCase()}.corp`],
      audit_log_configuration: {
        audit_log_destination: '${aws_cloudwatch_log_group.fsx.name}',
        file_access_audit_log_level: 'SUCCESS_AND_FAILURE',
        file_share_access_audit_log_level: 'SUCCESS_AND_FAILURE'
      },
      self_managed_active_directory: {
        dns_ips: ['10.0.0.100', '10.0.0.101'],
        domain_name: 'corp.example.com',
        password: `${generateResourceId()}Aa1!`,
        username: 'Admin',
        organizational_unit_distinguished_name: 'OU=FSx,DC=corp,DC=example,DC=com'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_subnet.main',
        'aws_security_group.default',
        'aws_cloudwatch_log_group.fsx'
      ]
    }

    return attributes
  }
} 