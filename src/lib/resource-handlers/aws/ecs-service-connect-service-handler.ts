import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const clusterId = generateResourceId('cluster')
    const taskDefId = generateResourceId('task')
    const sgId = generateResourceId('sg')
    const subnetId1 = generateResourceId('subnet')
    const subnetId2 = generateResourceId('subnet')
    const namespaceId = generateResourceId('namespace')

    const attributes: ResourceAttributes = {
      name: resourceName,
      cluster: clusterId,
      task_definition: taskDefId,
      desired_count: 1,
      launch_type: 'FARGATE',
      platform_version: 'LATEST',
      scheduling_strategy: 'REPLICA',
      deployment_maximum_percent: 200,
      deployment_minimum_healthy_percent: 100,
      enable_ecs_managed_tags: true,
      propagate_tags: 'SERVICE',
      service_connect_configuration: {
        enabled: true,
        namespace: `${resourceName}-${namespaceId}`,
        service: {
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
      },
      network_configuration: {
        subnets: [
          subnetId1,
          subnetId2
        ],
        security_groups: [sgId],
        assign_public_ip: true
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_ecs_cluster.${clusterId}`,
        `aws_ecs_task_definition.${taskDefId}`,
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_service_discovery_private_dns_namespace.${namespaceId}`
      ]
    }

    return attributes
  }
} 