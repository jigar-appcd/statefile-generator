import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSInternetGatewayHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    
    const attributes: ResourceAttributes = {
      vpc_id: vpcId,
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