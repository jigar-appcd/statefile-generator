import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId
} from '../base-handler'

export class AWSShieldProtectionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const resourceArn = generateResourceId('resource')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_arn: `REPLACE_WITH_RESOURCE_ARN_${resourceArn}`,
      tags: {
        Name: resourceName
      },
      depends_on: [
        `aws_shield_protection_group.${resourceArn}`
      ]
    }

    return attributes
  }
} 