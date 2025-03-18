import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectInstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const clusterId = generateResourceId('cluster')
    const serviceId = generateResourceId('service')
    const namespaceId = generateResourceId('namespace')
    const configId = generateResourceId('config')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      cluster: clusterId,
      service: serviceId,
      service_connect_configuration: {
        enabled: true,
        namespace: namespaceId,
        service: {
          client_alias: [
            {
              port: 80,
              dns_name: resourceName
            }
          ],
          port_name: 'http',
          discovery_name: resourceName,
          ingress_port_override: 8080
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_ecs_cluster.${clusterId}`,
        `aws_ecs_service.${serviceId}`,
        `aws_service_discovery_private_dns_namespace.${namespaceId}`,
        `aws_ecs_service_connect_configuration.${configId}`
      ]
    }

    return attributes
  }
} 