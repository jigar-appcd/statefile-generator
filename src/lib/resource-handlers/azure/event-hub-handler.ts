
import {
    generateResourceId,
    generateSubscriptionId,
    generateValidPassword
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureEventHubHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const eventHubId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const namespaceId = generateResourceId()
    const storageAccountId = generateResourceId()
    const containerId = generateResourceId()
    const subnetId = generateResourceId()
    const subscriptionId = generateSubscriptionId()
    
    const attributes: ResourceAttributes = {
      name: `evh-${eventHubId}`,
      namespace_name: `evhns-${namespaceId}`,
      resource_group_name: `rg-eventhub-${resourceGroupId}`,
      partition_count: 32,
      message_retention: 7,
      status: 'Active',
      capture_description: {
        enabled: true,
        encoding: 'Avro',
        interval_in_seconds: 300,
        size_limit_in_bytes: 314572800,
        skip_empty_archives: true,
        destination: {
          name: 'EventHubArchive.AzureBlockBlob',
          blob_container_name: `archive-${containerId}`,
          storage_account_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-eventhub-${resourceGroupId}/providers/Microsoft.Storage/storageAccounts/st${storageAccountId}`,
          archive_name_format: '{Namespace}/{EventHub}/{PartitionId}/{Year}/{Month}/{Day}/{Hour}/{Minute}/{Second}'
        }
      },
      network_rulesets: [
        {
          default_action: 'Deny',
          virtual_network_rule: [
            {
              subnet_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-eventhub-${resourceGroupId}/providers/Microsoft.Network/virtualNetworks/vnet-${resourceGroupId}/subnets/snet-${subnetId}`,
              ignore_missing_virtual_network_service_endpoint: false
            }
          ],
          ip_rule: [
            {
              ip_mask: '10.0.0.0/24',
              action: 'Allow'
            }
          ]
        }
      ],
      authorization_rule: [
        {
          name: 'producer',
          primary_key: generateValidPassword(),
          secondary_key: generateValidPassword(),
          listen: false,
          send: true,
          manage: false
        },
        {
          name: 'consumer',
          primary_key: generateValidPassword(),
          secondary_key: generateValidPassword(),
          listen: true,
          send: false,
          manage: false
        }
      ],
      consumer_group: [
        {
          name: 'default',
          user_metadata: 'Default consumer group'
        },
        {
          name: 'analytics',
          user_metadata: 'Analytics processing group'
        }
      ],
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_eventhub_namespace.${namespaceId}`,
        `azurerm_storage_account.${storageAccountId}`,
        `azurerm_storage_container.${containerId}`,
        `azurerm_subnet.${subnetId}`
      ]
    }

    return attributes
  }
} 