import { Region } from '@/types/cloud'
import {
  ResourceAttributes,
  ResourceHandler,
  commonTags,
  generateArn,
  generateResourceId
} from '../base-handler'

export class ECSServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const serviceId = generateResourceId('service')
    const clusterId = generateResourceId('cluster')
    const taskDefId = generateResourceId('task')
    const targetGroupId = generateResourceId('target')
    const sgId = generateResourceId('sg')
    const subnetId1 = generateResourceId('subnet')
    const subnetId2 = generateResourceId('subnet')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      cluster: clusterId,
      task_definition: generateArn('ecs', region, accountId, 'task-definition', `${taskDefId}:1`),
      desired_count: 2,
      launch_type: 'FARGATE',
      platform_version: 'LATEST',
      scheduling_strategy: 'REPLICA',
      force_new_deployment: true,
      deployment_maximum_percent: 200,
      deployment_minimum_healthy_percent: 100,
      health_check_grace_period_seconds: 60,
      network_configuration: {
        subnets: [
          subnetId1,
          subnetId2
        ],
        security_groups: [sgId],
        assign_public_ip: true
      },
      load_balancer: [
        {
          target_group_arn: generateArn('elasticloadbalancing', region, accountId, 'targetgroup', `${targetGroupId}/abcdef1234567890`),
          container_name: resourceName,
          container_port: 80
        }
      ],
      service_registries: [
        {
          registry_arn: generateArn('servicediscovery', region, accountId, 'service', serviceId),
          port: 80
        }
      ],
      ordered_placement_strategy: [
        {
          type: 'spread',
          field: 'attribute:ecs.availability-zone'
        },
        {
          type: 'spread',
          field: 'instanceId'
        }
      ],
      deployment_circuit_breaker: {
        enable: true,
        rollback: true
      },
      deployment_controller: {
        type: 'ECS'
      },
      enable_ecs_managed_tags: true,
      propagate_tags: 'SERVICE',
      enable_execute_command: false,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_ecs_cluster.${clusterId}`,
        `aws_ecs_task_definition.${taskDefId}`,
        `aws_lb_target_group.${targetGroupId}`,
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`
      ]
    }

    return attributes
  }
} 