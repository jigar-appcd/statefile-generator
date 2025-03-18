
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureEventGridSubscriptionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      scope: '${azurerm_resource_group.main.id}',
      event_delivery_schema: 'EventGridSchema',
      included_event_types: [
        'Microsoft.Resources.ResourceWriteSuccess',
        'Microsoft.Resources.ResourceDeleteSuccess'
      ],
      labels: ['audit', 'compliance'],
      advanced_filtering_on_arrays_enabled: true,
      advanced_filter: {
        string_begins_with: [
          {
            key: 'Subject',
            values: ['/subscriptions/']
          }
        ],
        string_not_in: [
          {
            key: 'EventType',
            values: ['Microsoft.Resources.ResourceDeleteFailure']
          }
        ]
      },
      azure_function_endpoint: {
        function_id: '${azurerm_function_app_function.event_processor.id}',
        max_events_per_batch: 100,
        preferred_batch_size_in_kilobytes: 64
      },
      webhook_endpoint: null,
      storage_queue_endpoint: null,
      hybrid_connection_endpoint: null,
      service_bus_queue_endpoint: null,
      service_bus_topic_endpoint: null,
      eventhub_endpoint: null,
      delivery_property: [
        {
          header_name: 'X-Event-Source',
          type: 'Static',
          value: 'CloudEvents',
          is_secret: false
        }
      ],
      dead_letter_destination: {
        storage_blob_container_name: '${azurerm_storage_container.dead_letter.name}',
        storage_account_id: '${azurerm_storage_account.events.id}'
      },
      retry_policy: {
        max_delivery_attempts: 30,
        event_time_to_live: 1440
      },
      storage_blob_dead_letter_destination: {
        storage_account_id: '${azurerm_storage_account.events.id}',
        storage_blob_container_name: '${azurerm_storage_container.dead_letter.name}'
      },
      depends_on: [
        'azurerm_function_app_function.event_processor',
        'azurerm_storage_account.events',
        'azurerm_storage_container.dead_letter'
      ]
    }

    return attributes
  }
} 