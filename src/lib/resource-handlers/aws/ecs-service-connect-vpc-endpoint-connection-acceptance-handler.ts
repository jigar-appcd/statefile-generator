import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectVPCEndpointConnectionAcceptanceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const serviceId = generateResourceId('service')
    const endpointId = generateResourceId('endpoint')
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_service_id: serviceId,
      vpc_endpoint_id: endpointId,
      accept_status: 'accept',
      depends_on: [
        `aws_vpc_endpoint_service.${serviceId}`,
        `aws_vpc_endpoint.${endpointId}`
      ]
    }

    return attributes
  }
} 