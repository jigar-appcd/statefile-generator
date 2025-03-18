import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectIAMRoleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const roleId = generateResourceId('role')

    const attributes: ResourceAttributes = {
      name: `${resourceName}-${roleId}`,
      assume_role_policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'ecs-tasks.amazonaws.com'
            },
            Action: 'sts:AssumeRole'
          }
        ]
      }),
      inline_policy: [
        {
          name: 'service-connect-policy',
          policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'ecs:CreateService',
                  'ecs:DeleteService',
                  'ecs:DescribeServices',
                  'ecs:UpdateService',
                  'servicediscovery:CreateService',
                  'servicediscovery:DeleteService',
                  'servicediscovery:GetService',
                  'servicediscovery:UpdateService'
                ],
                Resource: '*'
              }
            ]
          })
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 