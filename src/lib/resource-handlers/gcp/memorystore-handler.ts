import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPMemorystoreHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      memory_size_gb: 5,
      tier: 'STANDARD_HA',
      location_id: region.code,
      alternative_location_id: `${region.code}-a`,
      redis_version: 'REDIS_6_X',
      display_name: `${resourceName} Redis Instance`,
      redis_configs: {
        maxmemory_policy: 'allkeys-lru',
        notify_keyspace_events: 'KEA',
        activedefrag: 'yes'
      },
      authorized_network: '${google_compute_network.main.id}',
      connect_mode: 'PRIVATE_SERVICE_ACCESS',
      auth_enabled: true,
      transit_encryption_mode: 'SERVER_AUTHENTICATION',
      maintenance_policy: {
        weekly_maintenance_window: {
          day: 'SUNDAY',
          start_time: {
            hours: 2,
            minutes: 0,
            seconds: 0,
            nanos: 0
          }
        }
      },
      persistence_config: {
        persistence_mode: 'RDB',
        rdb_snapshot_period: '24h'
      },
      read_replicas_mode: 'READ_REPLICAS_ENABLED',
      replica_count: 2,
      customer_managed_key: '${google_kms_crypto_key.redis.id}',
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 