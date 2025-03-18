import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateBeanstalkRoleId
} from '../base-handler'

export class AWSECSServiceConnectRouterPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      role: generateArn('iam', region, accountId, 'role', roleId),
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'servicediscovery:DiscoverInstances',
              'servicediscovery:GetNamespace',
              'servicediscovery:ListNamespaces',
              'servicediscovery:GetService',
              'servicediscovery:ListServices'
            ],
            Resource: generateArn('servicediscovery', region, accountId, '*', '*')
          },
          {
            Effect: 'Allow',
            Action: [
              'ecs:UpdateService',
              'ecs:DescribeServices'
            ],
            Resource: generateArn('ecs', region, accountId, '*', '*')
          }
        ]
      }),
      depends_on: [
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 