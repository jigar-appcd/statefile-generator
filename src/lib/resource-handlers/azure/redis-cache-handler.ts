import { Region } from '@/types/cloud'
import {
    generateResourceId,
    generateSubscriptionId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureRedisCacheHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const redisId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const subscriptionId = generateSubscriptionId()
    const storageAccountId = generateResourceId()
    const subnetId = generateResourceId()
    const vnetId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `redis-${redisId}`,
      resource_group_name: `rg-redis-${resourceGroupId}`,
      location: region.code,
      capacity: 2,
      family: 'P',
      sku_name: 'Premium',
      enable_non_ssl_port: false,
      minimum_tls_version: '1.2',
      public_network_access_enabled: false,
      replicas_per_master: 1,
      redis_version: '6.0',
      zones: ['1', '2', '3'],
      redis_configuration: {
        aof_backup_enabled: true,
        aof_storage_connection_string_0: `/subscriptions/${subscriptionId}/resourceGroups/rg-redis-${resourceGroupId}/providers/Microsoft.Storage/storageAccounts/st${storageAccountId}/primaryBlobEndpoint`,
        aof_storage_connection_string_1: `/subscriptions/${subscriptionId}/resourceGroups/rg-redis-${resourceGroupId}/providers/Microsoft.Storage/storageAccounts/st${storageAccountId}/secondaryBlobEndpoint`,
        enable_authentication: true,
        maxmemory_reserved: 2,
        maxmemory_delta: 2,
        maxmemory_policy: 'allkeys-lru',
        maxfragmentationmemory_reserved: 2,
        rdb_backup_enabled: true,
        rdb_backup_frequency: 60,
        rdb_backup_max_snapshot_count: 1,
        rdb_storage_connection_string: `/subscriptions/${subscriptionId}/resourceGroups/rg-redis-${resourceGroupId}/providers/Microsoft.Storage/storageAccounts/st${storageAccountId}/primaryBlobEndpoint`
      },
      patch_schedule: [
        {
          day_of_week: 'Sunday',
          start_hour_utc: 2
        }
      ],
      private_static_ip_address: '10.0.1.10',
      subnet_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-redis-${resourceGroupId}/providers/Microsoft.Network/virtualNetworks/vnet-${vnetId}/subnets/snet-${subnetId}`,
      backup_configuration: {
        frequency_in_minutes: 60,
        max_snapshot_count: 1,
        storage_connection_string: `/subscriptions/${subscriptionId}/resourceGroups/rg-redis-${resourceGroupId}/providers/Microsoft.Storage/storageAccounts/st${storageAccountId}/primaryBlobEndpoint`
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_storage_account.${storageAccountId}`,
        `azurerm_subnet.${subnetId}`,
        `azurerm_virtual_network.${vnetId}`
      ]
    }

    return attributes
  }
} 