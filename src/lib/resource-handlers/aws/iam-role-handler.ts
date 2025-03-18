import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class IAMRoleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      path: '/',
      force_detach_policies: true,
      max_session_duration: 3600,
      description: `IAM role for ${resourceName}`,
      assume_role_policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'ec2.amazonaws.com'
            },
            Action: 'sts:AssumeRole'
          }
        ]
      }),
      inline_policy: [
        {
          name: 'default_permissions',
          policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents'
                ],
                Resource: '*'
              }
            ]
          })
        }
      ],
      managed_policy_arns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      ],
      permissions_boundary: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 