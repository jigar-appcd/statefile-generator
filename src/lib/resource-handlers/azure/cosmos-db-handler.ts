import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureCosmosDBHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      location: region.code,
      offer_type: 'Standard',
      kind: 'GlobalDocumentDB',
      enable_automatic_failover: true,
      enable_multiple_write_locations: true,
      enable_free_tier: false,
      analytical_storage_enabled: true,
      enable_serverless: false,
      public_network_access_enabled: false,
      is_virtual_network_filter_enabled: true,
      key_vault_key_id: '${azurerm_key_vault_key.cosmos.id}',
      create_mode: 'Default',
      default_identity_type: 'FirstPartyIdentity',
      consistency_policy: {
        consistency_level: 'BoundedStaleness',
        max_interval_in_seconds: 300,
        max_staleness_prefix: 100000
      },
      geo_location: [
        {
          location: region.code,
          failover_priority: 0,
          zone_redundant: true
        },
        {
          location: 'eastus2',
          failover_priority: 1,
          zone_redundant: true
        }
      ],
      backup: {
        type: 'Continuous',
        interval_in_minutes: 240,
        retention_in_hours: 720,
        storage_redundancy: 'Geo'
      },
      capabilities: [
        {
          name: 'EnableServerless'
        },
        {
          name: 'EnableMongo'
        },
        {
          name: 'EnableTable'
        }
      ],
      virtual_network_rule: [
        {
          id: '${azurerm_subnet.cosmos.id}',
          ignore_missing_vnet_service_endpoint: false
        }
      ],
      identity: {
        type: 'SystemAssigned'
      },
      analytical_storage: {
        schema_type: 'WellDefined'
      },
      capacity: {
        total_throughput_limit: 4000
      },
      cors_rule: [
        {
          allowed_headers: ['*'],
          allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowed_origins: ['https://example.com'],
          exposed_headers: ['ETag'],
          max_age_in_seconds: 3600
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 