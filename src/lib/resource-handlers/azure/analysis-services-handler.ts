import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureAnalysisServicesHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: 'S1',
      admin_users: [
        '${data.azuread_user.admin.user_principal_name}',
        '${data.azuread_group.analysts.members}'
      ],
      enable_power_bi_service: true,
      backup_blob_container_uri: '${azurerm_storage_container.analysis_backup.id}',
      ipv4_firewall_rule: [
        {
          name: 'allow-internal',
          range_start: '10.0.0.0',
          range_end: '10.0.0.255'
        }
      ],
      querypoolconnectionmode: 'All',
      server_full_name: '${resourceName}.asazure.windows.net',
      gateway: {
        gateway_resource_id: '${azurerm_analysis_services_gateway.main.id}',
        server_description: 'Production Analysis Services'
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 