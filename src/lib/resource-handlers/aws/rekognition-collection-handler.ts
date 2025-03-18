import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class RekognitionCollectionHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      collection_id: `${resourceName}-${generateResourceId()}`,
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