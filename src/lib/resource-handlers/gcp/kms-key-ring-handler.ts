import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPKMSKeyRingHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      import_only: false
    }

    return attributes
  }
} 