import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECSTaskSetHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const taskSetId = generateResourceId()
    const clusterId = generateResourceId()
    const serviceId = generateResourceId()
    const taskDefId = generateResourceId()
    const targetGroupId = generateResourceId()
    const subnetId1 = generateResourceId()
    const subnetId2 = generateResourceId()
    const sgId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      cluster: `ecs-cluster-${clusterId}`,
      service: `ecs-service-${serviceId}`,
      task_definition: `arn:aws:ecs:${region.code}:123456789012:task-definition/service-${taskDefId}:1`,
      launch_type: 'FARGATE',
      platform_version: 'LATEST',
      scale: {
        unit: 'PERCENT',
        value: 100
      },
      force_delete: true,
      wait_until_stable: true,
      wait_until_stable_timeout: '10m',
      network_configuration: {
        subnets: [
          `subnet-${subnetId1}`,
          `subnet-${subnetId2}`
        ],
        security_groups: [`sg-${sgId}`],
        assign_public_ip: true
      },
      load_balancer: [
        {
          target_group_arn: `arn:aws:elasticloadbalancing:${region.code}:123456789012:targetgroup/${targetGroupId}/abcdef1234567890`,
          container_name: 'web',
          container_port: 80
        }
      ],
      service_registries: [
        {
          registry_arn: `arn:aws:servicediscovery:${region.code}:123456789012:service/srv-${serviceId}`,
          port: 80
        }
      ],
      tags: {
        environment: 'production'
      },
      depends_on: [
        `aws_ecs_cluster.${clusterId}`,
        `aws_ecs_service.${serviceId}`,
        `aws_ecs_task_definition.${taskDefId}`,
        `aws_lb_target_group.${targetGroupId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_security_group.${sgId}`
      ]
    }

    return attributes
  }
} 