import {
    ResourceAttributes,
    ResourceHandler,
    commonTags
} from '../base-handler'

export class AWSCloudFrontOriginAccessIdentityHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      comment: `Origin Access Identity for ${resourceName}`,
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 