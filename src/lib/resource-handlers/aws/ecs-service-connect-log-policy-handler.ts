import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateBeanstalkRoleId,
    generateLogGroupId
} from '../base-handler'

export class AWSECSServiceConnectLogPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const logGroupId = generateLogGroupId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      role: generateArn('iam', region, accountId, 'role', roleId),
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
              'logs:DescribeLogStreams'
            ],
            Resource: [
              generateArn('logs', region, accountId, 'log-group', logGroupId),
              generateArn('logs', region, accountId, 'log-group', `${logGroupId}:*`)
            ]
          }
        ]
      }),
      depends_on: [
        `aws_iam_role.${roleId}`,
        `aws_cloudwatch_log_group.${logGroupId}`
      ]
    }

    return attributes
  }
} 