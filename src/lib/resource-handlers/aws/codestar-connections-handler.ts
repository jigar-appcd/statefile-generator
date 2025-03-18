import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class CodeStarConnectionsHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      provider_type: 'GitHub',
      host_arn: null,
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