import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECSTagHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      resource_arn: `arn:aws:ecs:${region.code}:123456789012:cluster/ecs-cluster-${clusterId}`,
      tags: {
        environment: 'production',
        project: 'infrastructure',
        team: 'platform',
        cost_center: 'platform-123'
      },
      depends_on: [
        `aws_ecs_cluster.${clusterId}`
      ]
    }

    return attributes
  }
} 