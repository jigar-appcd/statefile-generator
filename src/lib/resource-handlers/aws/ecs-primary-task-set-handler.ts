import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECSPrimaryTaskSetHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateResourceId()
    const serviceId = generateResourceId()
    const taskSetId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      cluster: `ecs-cluster-${clusterId}`,
      service: `ecs-service-${serviceId}`,
      task_set_id: `ecs-task-set-${taskSetId}`,
      depends_on: [
        `aws_ecs_cluster.${clusterId}`,
        `aws_ecs_service.${serviceId}`,
        `aws_ecs_task_set.${taskSetId}`
      ]
    }

    return attributes
  }
} 