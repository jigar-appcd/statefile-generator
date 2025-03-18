import {
    ResourceAttributes,
    ResourceHandler,
    commonTags
} from '../base-handler'

export class AWSRDSParameterGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      family: 'postgres15',
      description: `Parameter group for ${resourceName}`,
      parameter: [
        {
          name: 'max_connections',
          value: '100'
        },
        {
          name: 'shared_buffers',
          value: '{DBInstanceClassMemory/32768}'
        },
        {
          name: 'work_mem',
          value: '4096'
        },
        {
          name: 'maintenance_work_mem',
          value: '65536'
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 