import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECSAccountSettingDefaultHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: 'containerInstanceLongArnFormat',
      value: 'enabled',
      principal: '*',
      tags: {
        environment: 'production'
      }
    }

    return attributes
  }
} 