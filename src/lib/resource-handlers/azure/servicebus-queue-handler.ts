
import { generateResourceGroupName, generateServiceBusName } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureServiceBusQueueHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const namespaceName = generateServiceBusName('prod')
    const destinationName = generateServiceBusName('dest')
    const dlqName = generateServiceBusName('dlq')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      namespace_name: namespaceName,
      resource_group_name: generateResourceGroupName('prod', 'servicebus'),
      enable_partitioning: true,
      max_size_in_megabytes: 5120,
      requires_duplicate_detection: true,
      requires_session: true,
      default_message_ttl: 'P14D',
      dead_lettering_on_message_expiration: true,
      duplicate_detection_history_time_window: 'PT10M',
      max_delivery_count: 10,
      enable_batched_operations: true,
      status: 'Active',
      auto_delete_on_idle: 'P10675199DT2H48M5.4775807S',
      forward_to: destinationName,
      forward_dead_lettered_messages_to: dlqName,
      lock_duration: 'PT5M',
      authorization_rule: [
        {
          name: 'producer',
          send: true,
          listen: false,
          manage: false
        },
        {
          name: 'consumer',
          send: false,
          listen: true,
          manage: false
        }
      ],
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