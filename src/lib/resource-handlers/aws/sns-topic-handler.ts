import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class SNSTopicHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      display_name: resourceName,
      policy: null,
      delivery_policy: JSON.stringify({
        http: {
          defaultHealthyRetryPolicy: {
            minDelayTarget: 20,
            maxDelayTarget: 20,
            numRetries: 3,
            numMaxDelayRetries: 0,
            numNoDelayRetries: 0,
            numMinDelayRetries: 0,
            backoffFunction: 'linear'
          },
          disableSubscriptionOverrides: false
        }
      }),
      fifo_topic: false,
      content_based_deduplication: false,
      kms_master_key_id: '${aws_kms_key.sns.arn}',
      signature_version: '2',
      tracing_config: 'Active',
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