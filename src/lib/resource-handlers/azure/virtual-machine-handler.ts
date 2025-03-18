import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class AzureVirtualMachineHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const resourceGroupId = generateResourceId('rg')
    const networkInterfaceId = generateResourceId('nic')
    const storageAccountId = generateResourceId('sa')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: resourceGroupId,
      location: region.code,
      size: 'Standard_DS1_v2',
      admin_username: 'adminuser',
      network_interface_ids: [networkInterfaceId],
      os_disk: {
        caching: 'ReadWrite',
        storage_account_type: 'Premium_LRS',
        disk_size_gb: 30
      },
      source_image_reference: {
        publisher: 'Canonical',
        offer: 'UbuntuServer',
        sku: '18.04-LTS',
        version: 'latest'
      },
      computer_name: resourceName,
      disable_password_authentication: true,
      admin_ssh_key: {
        username: 'adminuser',
        public_key: '${file("~/.ssh/id_rsa.pub")}'
      },
      boot_diagnostics: {
        storage_account_uri: `https://${storageAccountId}.blob.core.windows.net/`
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_network_interface.${networkInterfaceId}`,
        `azurerm_storage_account.${storageAccountId}`
      ]
    }

    return attributes
  }
} 