import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class OpenSearchDomainHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      domain_name: `${resourceName}-${generateResourceId()}`,
      engine_version: 'OpenSearch_2.5',
      cluster_config: {
        instance_type: 't3.small.search',
        instance_count: 3,
        dedicated_master_enabled: true,
        dedicated_master_type: 't3.small.search',
        dedicated_master_count: 3,
        zone_awareness_enabled: true,
        zone_awareness_config: {
          availability_zone_count: 3
        },
        warm_enabled: true,
        warm_count: 2,
        warm_type: 'ultrawarm1.medium.search',
        cold_storage_options: {
          enabled: true
        }
      },
      ebs_options: {
        ebs_enabled: true,
        volume_type: 'gp3',
        volume_size: 100,
        iops: 3000,
        throughput: 125
      },
      vpc_options: {
        subnet_ids: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}', '${aws_subnet.private_3.id}'],
        security_group_ids: ['${aws_security_group.opensearch.id}']
      },
      snapshot_options: {
        automated_snapshot_start_hour: 23
      },
      encrypt_at_rest: {
        enabled: true,
        kms_key_id: '${aws_kms_key.opensearch.arn}'
      },
      node_to_node_encryption: {
        enabled: true
      },
      domain_endpoint_options: {
        enforce_https: true,
        tls_security_policy: 'Policy-Min-TLS-1-2-2019-07',
        custom_endpoint_enabled: true,
        custom_endpoint: `search.${resourceName}.example.com`,
        custom_endpoint_certificate_arn: '${aws_acm_certificate.opensearch.arn}'
      },
      advanced_security_options: {
        enabled: true,
        internal_user_database_enabled: true,
        master_user_options: {
          master_user_name: 'admin',
          master_user_password: `${generateResourceId()}Aa1!`
        },
        saml_options: {
          enabled: true,
          idp: {
            metadata_content: '${data.aws_ssm_parameter.saml_metadata.value}',
            entity_id: 'https://signin.aws.amazon.com/saml'
          },
          master_user_name: 'admin',
          master_backend_role: 'admin',
          subject_key: 'mail',
          roles_key: 'roles',
          session_timeout_minutes: 60
        }
      },
      log_publishing_options: {
        index_slow_logs: {
          enabled: true,
          cloudwatch_log_group_arn: '${aws_cloudwatch_log_group.opensearch_index_slow.arn}'
        },
        search_slow_logs: {
          enabled: true,
          cloudwatch_log_group_arn: '${aws_cloudwatch_log_group.opensearch_search_slow.arn}'
        },
        es_application_logs: {
          enabled: true,
          cloudwatch_log_group_arn: '${aws_cloudwatch_log_group.opensearch_application.arn}'
        },
        audit_logs: {
          enabled: true,
          cloudwatch_log_group_arn: '${aws_cloudwatch_log_group.opensearch_audit.arn}'
        }
      },
      auto_tune_options: {
        desired_state: 'ENABLED',
        maintenance_schedule: [
          {
            start_at: '2023-01-01T00:00:00Z',
            duration: {
              value: 2,
              unit: 'HOURS'
            },
            cron_expression_for_recurrence: 'cron(0 0 ? * SUN *)'
          }
        ],
        rollback_on_disable: 'NO_ROLLBACK'
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
        'aws_subnet.private_1',
        'aws_subnet.private_2',
        'aws_subnet.private_3',
        'aws_security_group.opensearch',
        'aws_kms_key.opensearch',
        'aws_acm_certificate.opensearch',
        'aws_cloudwatch_log_group.opensearch_index_slow',
        'aws_cloudwatch_log_group.opensearch_search_slow',
        'aws_cloudwatch_log_group.opensearch_application',
        'aws_cloudwatch_log_group.opensearch_audit'
      ]
    }

    return attributes
  }
} 