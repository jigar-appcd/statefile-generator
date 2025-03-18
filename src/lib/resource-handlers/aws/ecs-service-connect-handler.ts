import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const namespaceId = generateResourceId('namespace')
    const serviceId = generateResourceId('service')
    const logGroupId = generateResourceId('log')
    
    const attributes: ResourceAttributes = {
      namespace: `${resourceName}-${namespaceId}`,
      service: `${resourceName}-${serviceId}`,
      log_configuration: {
        log_driver: 'awslogs',
        options: {
          'awslogs-group': `${resourceName}-${logGroupId}`,
          'awslogs-region': region.code,
          'awslogs-stream-prefix': resourceName
        }
      },
      service_to_service_configuration: [
        {
          client_alias: [
            {
              dns_name: resourceName,
              port: 8080
            }
          ],
          discovery_name: resourceName,
          ingress_port_override: 8080,
          port_name: resourceName
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_service_discovery_http_namespace.${namespaceId}`,
        `aws_ecs_service.${serviceId}`,
        `aws_cloudwatch_log_group.${logGroupId}`
      ]
    }

    return attributes
  }
} 