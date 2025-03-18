import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectVPCEndpointServiceTagHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const serviceId = generateResourceId('service')
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_service_id: serviceId,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc_endpoint_service.${serviceId}`
      ]
    }

    return attributes
  }
} 