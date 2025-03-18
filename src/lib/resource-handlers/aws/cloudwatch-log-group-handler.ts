import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class CloudWatchLogGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `/aws/${resourceName}`,
      name_prefix: null,
      retention_in_days: 30,
      kms_key_id: '${aws_kms_key.logs.arn}',
      skip_destroy: false,
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