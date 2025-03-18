import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectLogGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const logGroupId = generateResourceId('log')

    const attributes: ResourceAttributes = {
      name: `${resourceName}-${logGroupId}`,
      retention_in_days: 30,
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 