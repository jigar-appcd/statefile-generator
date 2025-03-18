
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureStorageContainerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      storage_account_name: '${azurerm_storage_account.main.name}',
      container_access_type: 'private',
      metadata: {
        environment: 'production',
        purpose: 'data-storage'
      },
      timeouts: {
        create: '30m',
        read: '5m',
        update: '30m',
        delete: '30m'
      }
    }

    return attributes
  }
} 