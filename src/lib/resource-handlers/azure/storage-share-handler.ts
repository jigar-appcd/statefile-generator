
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureStorageShareHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const shareId = generateResourceId()
    const storageAccountId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `share-${shareId}`,
      storage_account_name: `st${storageAccountId}`,
      quota: 50,
      enabled_protocol: 'SMB',
      access_tier: 'Hot',
      acl: {
        id: 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI',
        permissions: 'rwdl'
      },
      metadata: {
        environment: 'production',
        purpose: 'file-share'
      },
      timeouts: {
        create: '30m',
        read: '5m',
        update: '30m',
        delete: '30m'
      },
      depends_on: [
        `azurerm_storage_account.${storageAccountId}`
      ]
    }

    return attributes
  }
} 