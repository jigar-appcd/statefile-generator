import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectExecutionRoleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const roleId = generateResourceId('role')

    const attributes: ResourceAttributes = {
      name: `${resourceName}-execution-${roleId}`,
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
      managed_policy_arns: [
        'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy'
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 