
import {
    generateResourceGroupName,
    generateResourceId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureStorageTableHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const resourceGroupName = generateResourceGroupName('prod', 'storage')
    const storageAccountId = generateResourceId()
    const tableId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `table${tableId}`,
      storage_account_name: `st${storageAccountId}`,
      acl: {
        id: 'access-rule-1',
        permissions: 'raud',
        start: '2023-01-01',
        expiry: '2024-12-31',
        start_ip: '10.0.0.0',
        end_ip: '10.0.0.255'
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_storage_account.${storageAccountId}`
      ]
    }

    return attributes
  }
} 