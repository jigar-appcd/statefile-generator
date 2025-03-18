import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureStorageQueueHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      storage_account_name: '${azurerm_storage_account.main.name}',
      metadata: {
        environment: 'production',
        purpose: 'message-queue'
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