import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class GCPCloudSQLHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const networkId = generateResourceId('network')
    const addressId = generateResourceId('address')
    const passwordId = generateResourceId('pwd')
    const kmsKeyId = generateResourceId('key')
    const projectId = generateResourceId('project')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: projectId,
      database_version: 'POSTGRES_14',
      region: region.code,
      deletion_protection: true,
      settings: {
        tier: 'db-f1-micro',
        edition: 'ENTERPRISE',
        availability_type: 'REGIONAL',
        disk_autoresize: true,
        disk_autoresize_limit: 50,
        disk_size: 10,
        disk_type: 'PD_SSD',
        backup_configuration: {
          enabled: true,
          start_time: '02:00',
          location: region.code,
          point_in_time_recovery_enabled: true,
          transaction_log_retention_days: 7,
          retained_backups: 7,
          retention_unit: 'COUNT'
        },
        ip_configuration: {
          ipv4_enabled: true,
          require_ssl: true,
          ssl_mode: 'TRUSTED_CLIENT_CERTIFICATE',
          authorized_networks: [
            {
              name: 'allow-internal',
              value: '10.0.0.0/8'
            }
          ],
          private_network: `projects/${projectId}/global/networks/${networkId}`,
          allocated_ip_range: addressId,
          enable_private_path_for_google_cloud_services: true
        },
        database_flags: [
          {
            name: 'max_connections',
            value: '100'
          },
          {
            name: 'log_min_duration_statement',
            value: '300'
          }
        ],
        insights_config: {
          query_insights_enabled: true,
          query_string_length: 1024,
          record_application_tags: true,
          record_client_address: true,
          query_plans_per_minute: 5
        },
        maintenance_window: {
          day: 7,
          hour: 3,
          update_track: 'stable'
        },
        password_validation_policy: {
          complexity: 'COMPLEXITY_DEFAULT',
          disallow_username_substring: true,
          enable_password_policy: true,
          min_length: 8,
          password_change_interval: '7200s',
          reuse_interval: '7200s'
        }
      },
      root_password: `${resourceName}-${passwordId}`,
      encryption_key_name: `projects/${projectId}/locations/${region.code}/keyRings/sql/cryptoKeys/${kmsKeyId}`,
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        `google_compute_network.${networkId}`,
        `google_compute_global_address.${addressId}`,
        `google_kms_crypto_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 