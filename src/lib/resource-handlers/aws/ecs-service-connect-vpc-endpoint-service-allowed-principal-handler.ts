import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectVPCEndpointServiceAllowedPrincipalHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const serviceId = generateResourceId('vpce-service')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_service_id: serviceId,
      principal_arn: generateArn('iam', region, accountId, 'root', ''),
      depends_on: [
        `aws_vpc_endpoint_service.${serviceId}`
      ]
    }

    return attributes
  }
} 