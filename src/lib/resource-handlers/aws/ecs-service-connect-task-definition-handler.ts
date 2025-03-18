import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectTaskDefinitionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const roleId = generateResourceId('role')
    const logGroupId = generateResourceId('log')
    const accountId = '123456789012'

    const attributes: ResourceAttributes = {
      family: resourceName,
      requires_compatibilities: ['FARGATE'],
      network_mode: 'awsvpc',
      cpu: '256',
      memory: '512',
      execution_role_arn: `arn:aws:iam::${accountId}:role/${resourceName}-execution-${roleId}`,
      task_role_arn: `arn:aws:iam::${accountId}:role/${resourceName}-task-${roleId}`,
      container_definitions: JSON.stringify([
        {
          name: resourceName,
          image: 'nginx:latest',
          cpu: 256,
          memory: 512,
          essential: true,
          portMappings: [
            {
              containerPort: 8080,
              hostPort: 8080,
              protocol: 'tcp',
              name: resourceName,
              appProtocol: 'http'
            }
          ],
          logConfiguration: {
            logDriver: 'awslogs',
            options: {
              'awslogs-group': `${resourceName}-${logGroupId}`,
              'awslogs-region': 'us-west-2',
              'awslogs-stream-prefix': resourceName
            }
          }
        }
      ]),
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_iam_role.${roleId}`,
        `aws_cloudwatch_log_group.${logGroupId}`
      ]
    }

    return attributes
  }
} 