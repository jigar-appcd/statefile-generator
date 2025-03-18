import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectRoleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const policyId = generateResourceId('policy')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
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
      description: `Service Connect role for ${resourceName}`,
      force_detach_policies: true,
      managed_policy_arns: [
        'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy'
      ],
      max_session_duration: 3600,
      path: '/service-role/',
      permissions_boundary: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_iam_policy.${policyId}`
      ]
    }

    return attributes
  }
} 