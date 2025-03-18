import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureEventGridTopicHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      input_schema: 'EventGridSchema',
      public_network_access_enabled: false,
      local_auth_enabled: true,
      identity: {
        type: 'SystemAssigned'
      },
      input_mapping_fields: {
        id: ['id'],
        topic: ['topic'],
        eventtime: ['eventTime'],
        subject: ['subject'],
        eventtype: ['eventType'],
        dataversion: ['dataVersion']
      },
      input_mapping_default_values: {
        event_type: 'DefaultEventType',
        subject: 'DefaultSubject',
        data_version: '1.0'
      },
      inbound_ip_rule: [
        {
          ip_mask: '10.0.0.0/24',
          action: 'Allow'
        }
      ],
      private_endpoint_connection: {
        name: '${resourceName}-endpoint',
        is_manual_connection: false,
        subresource_names: ['topic']
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 