import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectVPCEndpointServicePermissionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const serviceId = generateResourceId('service')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_service_id: serviceId,
      principal_arn: `arn:aws:iam::${accountId}:role/${resourceName}`,
      depends_on: [
        `aws_vpc_endpoint_service.${serviceId}`
      ]
    }

    return attributes
  }
} 