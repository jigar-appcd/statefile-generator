import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectProxyPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateResourceId('role')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      role: generateArn('iam', region, accountId, 'role', `${resourceName}-proxy-${roleId}`),
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: `${resourceName}ServiceDiscovery`,
            Effect: 'Allow',
            Action: [
              'servicediscovery:DiscoverInstances',
              'servicediscovery:GetNamespace',
              'servicediscovery:ListNamespaces',
              'servicediscovery:GetService',
              'servicediscovery:ListServices',
              'servicediscovery:GetInstance'
            ],
            Resource: generateArn('servicediscovery', region, accountId, '*', '*')
          },
          {
            Sid: `${resourceName}ECSAccess`,
            Effect: 'Allow',
            Action: [
              'ecs:DescribeServices',
              'ecs:DescribeTasks'
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