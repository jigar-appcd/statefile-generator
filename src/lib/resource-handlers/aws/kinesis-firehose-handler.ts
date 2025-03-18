import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateResourceId
} from '../base-handler'

export class AWSKinesisFirehoseHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const bucketId = generateResourceId('bucket').toLowerCase()
    const kmsKeyId = generateResourceId('key')
    const roleId = generateResourceId('role')
    const logGroupId = generateResourceId('log')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      destination: 's3',
      s3_configuration: {
        role_arn: generateArn('iam', region, accountId, 'role', `${resourceName}-firehose-${roleId}`),
        bucket_arn: generateArn('s3', region, accountId, 'bucket', `${resourceName}-${bucketId}`),
        prefix: 'data/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/',
        error_output_prefix: 'errors/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/!{firehose:error-output-type}/',
        buffer_size: 128,
        buffer_interval: 300,
        compression_format: 'GZIP',
        kms_key_arn: generateArn('kms', region, accountId, 'key', kmsKeyId)
      },
      server_side_encryption: {
        enabled: true,
        key_type: 'CUSTOMER_MANAGED_CMK',
        key_arn: generateArn('kms', region, accountId, 'key', kmsKeyId)
      },
      extended_s3_configuration: {
        processing_configuration: {
          enabled: true,
          processors: [
            {
              type: 'MetadataExtraction',
              parameters: [
                {
                  parameter_name: 'JsonParsingEngine',
                  parameter_value: 'JQ-1.6'
                },
                {
                  parameter_name: 'MetadataExtractionQuery',
                  parameter_value: '{timestamp:.timestamp}'
                }
              ]
            }
          ]
        },
        data_format_conversion_configuration: {
          enabled: true,
          input_format_configuration: {
            deserializer: {
              open_x_json_ser_de: {
                case_insensitive: true,
                convert_dots_in_json_keys_to_underscores: true
              }
            }
          },
          output_format_configuration: {
            serializer: {
              parquet_ser_de: {
                compression: 'SNAPPY',
                enable_dictionary_compression: true
              }
            }
          },
          schema_version: 'LATEST'
        }
      },
      cloudwatch_logging_options: {
        enabled: true,
        log_group_name: `${resourceName}-${logGroupId}`,
        log_stream_name: resourceName
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_s3_bucket.${bucketId}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_iam_role.${roleId}`,
        `aws_cloudwatch_log_group.${logGroupId}`
      ]
    }

    return attributes
  }
} 