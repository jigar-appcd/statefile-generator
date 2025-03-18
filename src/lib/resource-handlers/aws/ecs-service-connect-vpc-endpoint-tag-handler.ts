import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectVPCEndpointTagHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcEndpointId = generateResourceId('vpce')
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_id: vpcEndpointId,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc_endpoint.${vpcEndpointId}`
      ]
    }

    return attributes
  }
} 