import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class BackupPlanHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      rule: [
        {
          rule_name: 'daily_backup',
          target_vault_name: '${aws_backup_vault.main.name}',
          schedule: 'cron(0 5 ? * * *)',
          start_window: 60,
          completion_window: 120,
          recovery_point_tags: {
            Environment: 'Production'
          },
          lifecycle: {
            cold_storage_after: 30,
            delete_after: 120
          },
          copy_action: {
            destination_vault_arn: '${aws_backup_vault.replica.arn}',
            lifecycle: {
              cold_storage_after: 30,
              delete_after: 120
            }
          },
          enable_continuous_backup: true
        },
        {
          rule_name: 'weekly_backup',
          target_vault_name: '${aws_backup_vault.main.name}',
          schedule: 'cron(0 5 ? * SAT *)',
          start_window: 60,
          completion_window: 120,
          lifecycle: {
            cold_storage_after: 90,
            delete_after: 365
          }
        }
      ],
      advanced_backup_setting: [
        {
          resource_type: 'EC2',
          backup_options: {
            WindowsVSS: 'enabled'
          }
        }
      ],
      selection: {
        name: 'backup_selection',
        iam_role_arn: '${aws_iam_role.backup.arn}',
        selection_tag: [
          {
            type: 'STRINGEQUALS',
            key: 'Backup',
            value: 'true'
          }
        ],
        condition: {
          string_equals: [
            {
              key: 'aws:ResourceTag/Environment',
              value: 'Production'
            }
          ],
          string_like: [
            {
              key: 'aws:ResourceTag/Application',
              value: '*critical*'
            }
          ]
        },
        not_resources: [
          'arn:aws:dynamodb:*:*:table/temp-*',
          'arn:aws:rds:*:*:cluster:test-*'
        ],
        resources: [
          'arn:aws:ec2:*:*:instance/*',
          'arn:aws:rds:*:*:db:*',
          'arn:aws:dynamodb:*:*:table/*'
        ]
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
        'aws_backup_vault.main',
        'aws_backup_vault.replica',
        'aws_iam_role.backup'
      ]
    }

    return attributes
  }
} 