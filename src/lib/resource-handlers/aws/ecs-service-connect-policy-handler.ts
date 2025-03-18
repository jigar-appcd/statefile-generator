import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const roleId = generateResourceId('role')
    const namespaceId = generateResourceId('namespace')
    
    const attributes: ResourceAttributes = {
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: `ServiceConnectPolicy-${resourceName}`,
            Effect: 'Allow',
            Action: [
              'ecs:CreateService',
              'ecs:UpdateService',
              'ecs:DeleteService',
              'ecs:DescribeServices',
              'servicediscovery:CreateService',
              'servicediscovery:DeleteService',
              'servicediscovery:GetNamespace',
              'servicediscovery:ListServices'
            ],
            Resource: '*'
          }
        ]
      }),
      role: roleId,
      depends_on: [
        `aws_iam_role.${roleId}`,
        `aws_service_discovery_private_dns_namespace.${namespaceId}`
      ]
    }

    return attributes
  }
} 