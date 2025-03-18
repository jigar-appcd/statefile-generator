import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureIoTHubHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: {
        name: 'S1',
        capacity: 1
      },
      endpoint: {
        type: 'AzureIotHub.StorageContainer',
        connection_string: '${azurerm_storage_account.iot.primary_blob_connection_string}',
        name: 'export',
        batch_frequency_in_seconds: 60,
        max_chunk_size_in_bytes: 314572800,
        container_name: '${azurerm_storage_container.iot.name}',
        encoding: 'Avro',
        file_name_format: '{iothub}/{partition}_{YYYY}_{MM}_{DD}_{HH}_{mm}'
      },
      route: {
        name: 'export',
        source: 'DeviceMessages',
        condition: 'true',
        endpoint_names: ['export'],
        enabled: true
      },
      enrichment: {
        key: 'tenant',
        value: '${data.azurerm_client_config.current.tenant_id}',
        endpoint_names: ['export']
      },
      cloud_to_device: {
        max_delivery_count: 10,
        default_ttl: 'PT1H',
        feedback: {
          time_to_live: 'PT1H10M',
          max_delivery_count: 10,
          lock_duration: 'PT30S'
        }
      },
      file_upload: {
        connection_string: '${azurerm_storage_account.iot.primary_blob_connection_string}',
        container_name: '${azurerm_storage_container.iot_files.name}',
        sas_ttl: 'PT1H',
        notifications: true,
        lock_duration: 'PT1M',
        default_ttl: 'PT1H',
        max_delivery_count: 10
      },
      ip_filter_rule: [
        {
          name: 'allow-internal',
          ip_mask: '10.0.0.0/24',
          action: 'Accept'
        }
      ],
      network_rule_set: {
        default_action: 'Deny',
        apply_to_builtin_eventhub_endpoint: true,
        ip_rule: [
          {
            ip_mask: '10.0.0.0/24',
            action: 'Allow'
          }
        ],
        virtual_network_rule: [
          {
            subnet_id: '${azurerm_subnet.iot.id}',
            ignore_missing_vnet_service_endpoint: false
          }
        ]
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