import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectVPCEndpointPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const endpointId = generateResourceId('vpce')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_id: endpointId,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: [
              'ecs:DiscoverPollEndpoint',
              'ecs:Poll',
              'ecs:StartTelemetrySession'
            ],
            Resource: generateArn('ecs', region, accountId, '*', '*')
          }
        ]
      }),
      depends_on: [
        `aws_vpc_endpoint.${endpointId}`
      ]
    }

    return attributes
  }
} 