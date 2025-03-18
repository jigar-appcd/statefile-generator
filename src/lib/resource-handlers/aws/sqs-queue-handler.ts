import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class SQSQueueHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      delay_seconds: 0,
      max_message_size: 262144,
      message_retention_seconds: 345600,
      receive_wait_time_seconds: 0,
      visibility_timeout_seconds: 30,
      fifo_queue: false,
      content_based_deduplication: false,
      deduplication_scope: null,
      fifo_throughput_limit: null,
      kms_master_key_id: '${aws_kms_key.sqs.arn}',
      kms_data_key_reuse_period_seconds: 300,
      policy: null,
      redrive_policy: JSON.stringify({
        deadLetterTargetArn: '${aws_sqs_queue.dlq.arn}',
        maxReceiveCount: 3
      }),
      redrive_allow_policy: null,
      sqs_managed_sse_enabled: true,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 