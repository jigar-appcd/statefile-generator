import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectNamespaceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      vpc: vpcId,
      description: `Service Connect namespace for ${resourceName}`,
      type: 'HTTP',
      http_name: resourceName,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`
      ]
    }

    return attributes
  }
} 