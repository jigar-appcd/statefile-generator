import { Region } from '@/types/cloud'
import {
  ResourceAttributes,
  ResourceHandler,
  generateResourceId
} from '../base-handler'

export class AWSECSClusterCapacityProvidersHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateResourceId('cluster')
    
    const attributes: ResourceAttributes = {
      cluster_name: `${resourceName}-${clusterId}`,
      capacity_providers: [
        'FARGATE',
        'FARGATE_SPOT'
      ],
      default_capacity_provider_strategy: [
        {
          base: 1,
          weight: 3,
          capacity_provider: 'FARGATE'
        },
        {
          weight: 1,
          capacity_provider: 'FARGATE_SPOT'
        }
      ],
      depends_on: [
        `aws_ecs_cluster.${clusterId}`
      ]
    }

    return attributes
  }
} 