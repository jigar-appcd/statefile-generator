import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class KinesisStreamHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      shard_count: 3,
      retention_period: 168,
      shard_level_metrics: [
        'IncomingBytes',
        'OutgoingBytes',
        'IncomingRecords',
        'OutgoingRecords',
        'WriteProvisionedThroughputExceeded',
        'ReadProvisionedThroughputExceeded',
        'IteratorAgeMilliseconds'
      ],
      enforce_consumer_deletion: true,
      encryption_type: 'KMS',
      kms_key_id: '${aws_kms_key.kinesis.arn}',
      stream_mode_details: {
        stream_mode: 'ON_DEMAND'
      },
      timeouts: {
        create: '15m',
        update: '120m',
        delete: '15m'
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
        'aws_kms_key.kinesis'
      ]
    }

    return attributes
  }
} 