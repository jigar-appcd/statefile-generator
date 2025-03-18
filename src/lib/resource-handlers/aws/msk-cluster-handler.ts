import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class MSKClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      cluster_name: `${resourceName}-${generateResourceId()}`,
      kafka_version: '3.4.0',
      number_of_broker_nodes: 3,
      broker_node_group_info: {
        instance_type: 'kafka.t3.small',
        client_subnets: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}', '${aws_subnet.private_3.id}'],
        security_groups: ['${aws_security_group.msk.id}'],
        storage_info: {
          ebs_storage_info: {
            volume_size: 100,
            provisioned_throughput: {
              enabled: true,
              volume_throughput: 250
            }
          }
        },
        connectivity_info: {
          public_access: {
            type: 'SERVICE_PROVIDED_EIPS'
          }
        }
      },
      encryption_info: {
        encryption_at_rest_kms_key_arn: '${aws_kms_key.msk.arn}',
        encryption_in_transit: {
          client_broker: 'TLS',
          in_cluster: true
        }
      },
      enhanced_monitoring: 'PER_BROKER',
      open_monitoring: {
        prometheus: {
          jmx_exporter: {
            enabled_in_broker: true
          },
          node_exporter: {
            enabled_in_broker: true
          }
        }
      },
      logging_info: {
        broker_logs: {
          cloudwatch_logs: {
            enabled: true,
            log_group: '${aws_cloudwatch_log_group.msk.name}'
          },
          firehose: {
            enabled: true,
            delivery_stream: '${aws_kinesis_firehose_delivery_stream.msk.name}'
          },
          s3: {
            enabled: true,
            bucket: '${aws_s3_bucket.msk_logs.id}',
            prefix: 'logs/msk-'
          }
        }
      },
      configuration_info: {
        arn: '${aws_msk_configuration.main.arn}',
        revision: 1
      },
      client_authentication: {
        sasl: {
          iam: {
            enabled: true
          }
        },
        tls: {
          certificate_authority_arns: ['${aws_acmpca_certificate_authority.msk.arn}']
        }
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
        'aws_security_group.msk',
        'aws_kms_key.msk',
        'aws_cloudwatch_log_group.msk',
        'aws_kinesis_firehose_delivery_stream.msk',
        'aws_s3_bucket.msk_logs',
        'aws_msk_configuration.main',
        'aws_acmpca_certificate_authority.msk'
      ]
    }

    return attributes
  }
} 