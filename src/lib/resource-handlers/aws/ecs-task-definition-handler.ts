import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateResourceId
} from '../base-handler'

export class ECSTaskDefinitionHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const serviceId = generateResourceId('service')
    const roleId = generateResourceId('role')
    const kmsKeyId = generateResourceId('key')
    const logGroupId = generateResourceId('log')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      family: resourceName,
      requires_compatibilities: ['FARGATE'],
      network_mode: 'awsvpc',
      cpu: '256',
      memory: '512',
      execution_role_arn: generateArn('iam', region, accountId, 'role', `${resourceName}-execution-${roleId}`),
      task_role_arn: generateArn('iam', region, accountId, 'role', `${resourceName}-task-${roleId}`),
      container_definitions: JSON.stringify([
        {
          name: resourceName,
          image: `${accountId}.dkr.ecr.${region.code}.amazonaws.com/${resourceName}:latest`,
          cpu: 256,
          memory: 512,
          essential: true,
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: 'tcp'
            }
          ],
          logConfiguration: {
            logDriver: 'awslogs',
            options: {
              'awslogs-group': `${resourceName}-${logGroupId}`,
              'awslogs-region': region.code,
              'awslogs-stream-prefix': resourceName
            }
          },
          environment: [
            {
              name: 'SERVICE_NAME',
              value: resourceName
            }
          ],
          mountPoints: [],
          volumesFrom: [],
          healthCheck: {
            command: ['CMD-SHELL', 'curl -f http://localhost/ || exit 1'],
            interval: 30,
            timeout: 5,
            retries: 3,
            startPeriod: 60
          }
        }
      ]),
      volume: [
        {
          name: `${resourceName}-storage`,
          efs_volume_configuration: {
            file_system_id: serviceId,
            root_directory: '/',
            transit_encryption: 'ENABLED',
            transit_encryption_port: 2999,
            authorization_config: {
              access_point_id: serviceId,
              iam: 'ENABLED'
            }
          }
        }
      ],
      ephemeral_storage: {
        size_in_gib: 20
      },
      proxy_configuration: {
        type: 'APPMESH',
        container_name: 'envoy',
        properties: {
          AppPorts: '80',
          EgressIgnoredIPs: '169.254.170.2,169.254.169.254',
          IgnoredUID: '1337',
          ProxyEgressPort: '15001',
          ProxyIngressPort: '15000'
        }
      },
      runtime_platform: {
        operating_system_family: 'LINUX',
        cpu_architecture: 'X86_64'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_iam_role.${roleId}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_cloudwatch_log_group.${logGroupId}`
      ]
    }

    return attributes
  }
} 