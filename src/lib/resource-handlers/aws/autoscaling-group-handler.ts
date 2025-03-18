import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AutoScalingGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const asgId = generateResourceId('asg')
    const launchTemplateId = generateResourceId('template')
    const subnet1Id = generateResourceId('subnet')
    const subnet2Id = generateResourceId('subnet')
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${asgId}`,
      max_size: 5,
      min_size: 1,
      desired_capacity: 2,
      health_check_type: 'ELB',
      health_check_grace_period: 300,
      force_delete: false,
      termination_policies: ['OldestInstance', 'Default'],
      suspended_processes: [],
      placement_group: '',
      metrics_granularity: '1Minute',
      enabled_metrics: [
        'GroupMinSize',
        'GroupMaxSize',
        'GroupDesiredCapacity',
        'GroupInServiceInstances',
        'GroupPendingInstances',
        'GroupStandbyInstances',
        'GroupTerminatingInstances',
        'GroupTotalInstances'
      ],
      launch_template: {
        id: launchTemplateId,
        version: '$Latest'
      },
      vpc_zone_identifier: [
        subnet1Id,
        subnet2Id
      ],
      instance_refresh: {
        strategy: 'Rolling',
        preferences: {
          min_healthy_percentage: 90,
          instance_warmup: 300
        },
        triggers: ['tag']
      },
      mixed_instances_policy: {
        instances_distribution: {
          on_demand_base_capacity: 1,
          on_demand_percentage_above_base_capacity: 50,
          spot_allocation_strategy: 'capacity-optimized',
          spot_instance_pools: 2,
          spot_max_price: ''
        },
        launch_template: {
          launch_template_specification: {
            launch_template_id: launchTemplateId,
            version: '$Latest'
          },
          override: [
            {
              instance_type: 't3.micro',
              weighted_capacity: '2'
            },
            {
              instance_type: 't3.small',
              weighted_capacity: '1'
            }
          ]
        }
      },
      warm_pool: {
        pool_state: 'Stopped',
        min_size: 1,
        max_group_prepared_capacity: 2,
        instance_reuse_policy: {
          reuse_on_scale_in: true
        }
      },
      tags: [
        {
          key: 'Name',
          value: resourceName,
          propagate_at_launch: true
        },
        ...Object.entries(commonTags).map(([key, value]) => ({
          key,
          value,
          propagate_at_launch: true
        }))
      ],
      depends_on: [
        `aws_launch_template.${launchTemplateId}`,
        `aws_subnet.${subnet1Id}`,
        `aws_subnet.${subnet2Id}`
      ]
    }

    return attributes
  }
} 