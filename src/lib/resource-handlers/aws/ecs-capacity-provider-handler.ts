import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateResourceId
} from '../base-handler'

export class ECSCapacityProviderHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const providerId = generateResourceId('provider')
    const asgId = generateResourceId('asg')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${providerId}`,
      auto_scaling_group_provider: {
        auto_scaling_group_arn: generateArn('autoscaling', region, accountId, 'autoScalingGroup', `${resourceName}-${asgId}`),
        managed_termination_protection: 'ENABLED',
        managed_scaling: {
          maximum_scaling_step_size: 10000,
          minimum_scaling_step_size: 1,
          status: 'ENABLED',
          target_capacity: 100,
          instance_warmup_period: 300
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_autoscaling_group.${asgId}`
      ]
    }

    return attributes
  }
} 