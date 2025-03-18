import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateInstanceId
} from '../base-handler'

export class AWSElasticIPHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const instanceId = generateInstanceId()
    
    const attributes: ResourceAttributes = {
      instance: instanceId,
      vpc: true,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_instance.${instanceId}`
      ]
    }

    return attributes
  }
} 