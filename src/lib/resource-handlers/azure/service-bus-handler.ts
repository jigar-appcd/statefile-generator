import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureServiceBusHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      location: region.code,
      sku: 'Premium',
      capacity: 2,
      zone_redundant: true,
      identity: {
        type: 'SystemAssigned'
      },
      customer_managed_key: {
        key_vault_key_id: '${azurerm_key_vault_key.servicebus.id}',
        identity_id: '${azurerm_user_assigned_identity.servicebus.id}'
      },
      topic: [
        {
          name: 'events',
          enable_partitioning: true,
          max_size_in_megabytes: 5120,
          requires_duplicate_detection: true,
          duplicate_detection_history_time_window: 'PT10M',
          support_ordering: true,
          enable_batched_operations: true,
          authorization_rule: [
            {
              name: 'publisher',
              send: true,
              listen: false,
              manage: false
            },
            {
              name: 'subscriber',
              send: false,
              listen: true,
              manage: false
            }
          ],
          subscription: [
            {
              name: 'processor',
              max_delivery_count: 10,
              lock_duration: 'PT5M',
              enable_batched_operations: true,
              requires_session: true,
              forward_to: '${azurerm_servicebus_queue.dlq.name}',
              dead_lettering_on_message_expiration: true,
              default_message_ttl: 'P14D',
              auto_delete_on_idle: 'P14D',
              filter_rule: [
                {
                  name: 'priority-messages',
                  sql_filter: "priority = 'high'"
                }
              ]
            }
          ]
        }
      ],
      queue: [
        {
          name: 'tasks',
          enable_partitioning: true,
          lock_duration: 'PT5M',
          max_size_in_megabytes: 5120,
          requires_duplicate_detection: true,
          requires_session: true,
          dead_lettering_on_message_expiration: true,
          duplicate_detection_history_time_window: 'PT10M',
          max_delivery_count: 10,
          enable_batched_operations: true,
          authorization_rule: [
            {
              name: 'sender',
              send: true,
              listen: false,
              manage: false
            },
            {
              name: 'receiver',
              send: false,
              listen: true,
              manage: false
            }
          ]
        }
      ],
      network_rule_set: {
        default_action: 'Deny',
        ip_rules: ['10.0.0.0/24'],
        virtual_network_rule: [
          {
            subnet_id: '${azurerm_subnet.servicebus.id}',
            ignore_missing_vnet_service_endpoint: false
          }
        ]
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 