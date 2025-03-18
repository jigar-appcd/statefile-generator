import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureLogicAppWorkflowHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      workflow_schema: 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
      workflow_version: '1.0.0.0',
      parameters: {
        environment: {
          type: 'String',
          defaultValue: 'production'
        },
        logicAppServiceUrl: {
          type: 'String',
          defaultValue: '${azurerm_app_service.logic.default_site_hostname}'
        }
      },
      access_control: {
        action: {
          allowed_caller_ip_addresses: [
            {
              address_range: '10.0.0.0/24',
              description: 'Internal network'
            }
          ]
        },
        trigger: {
          allowed_caller_ip_addresses: [
            {
              address_range: '10.0.0.0/24',
              description: 'Internal network'
            }
          ]
        },
        content: {
          allowed_caller_ip_addresses: [
            {
              address_range: '10.0.0.0/24',
              description: 'Internal network'
            }
          ]
        }
      },
      integration_service_environment_id: null,
      enabled: true,
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