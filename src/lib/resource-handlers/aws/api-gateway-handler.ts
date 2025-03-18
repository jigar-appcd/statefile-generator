import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class APIGatewayHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      description: `API Gateway for ${resourceName}`,
      endpoint_configuration: {
        types: ['REGIONAL'],
        vpc_endpoint_ids: []
      },
      disable_execute_api_endpoint: false,
      minimum_compression_size: -1,
      api_key_source: 'HEADER',
      binary_media_types: ['application/octet-stream', 'image/*'],
      policy: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 