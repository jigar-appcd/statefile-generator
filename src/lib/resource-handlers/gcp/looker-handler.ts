import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPLookerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: '${data.google_project.current.project_id}',
      location: region.code,
      instance: {
        name: resourceName,
        platform_edition: 'ENTERPRISE',
        oauth_config: {
          client_id: '${google_oauth_client.looker.client_id}',
          client_secret: '${google_oauth_client.looker.client_secret}'
        },
        encryption_config: {
          kms_key_name: '${google_kms_crypto_key.looker.id}'
        },
        maintenance_window: {
          day: 'SUNDAY',
          hour: 2
        },
        deny_maintenance_period: {
          start_date: {
            year: 2023,
            month: 11,
            day: 1
          },
          end_date: {
            year: 2023,
            month: 12,
            day: 31
          },
          time: {
            hours: 0,
            minutes: 0,
            seconds: 0,
            nanos: 0
          }
        },
        backup_config: {
          enabled: true,
          schedule: 'every 24 hours'
        },
        network_config: {
          network: '${google_compute_network.main.id}',
          reserved_ip_range: '10.0.0.0/24'
        },
        admin_settings: {
          allowed_email_domains: ['example.com'],
          user_attribute_config: {
            user_attributes: [
              {
                name: 'region',
                type: 'string',
                default_value: region.code,
                hidden: false
              }
            ]
          }
        }
      },
      connection: {
        name: 'bigquery',
        database: '${google_bigquery_dataset.main.dataset_id}',
        host: 'bigquery.googleapis.com',
        certificate: '${google_compute_ssl_certificate.looker.certificate}',
        max_connections: 50,
        ssl: true,
        verify_ssl: true,
        timezone: 'UTC'
      },
      model: {
        name: 'analytics',
        project_name: 'analytics',
        connection_name: 'bigquery',
        includes: ['*.view.lkml', '*.explore.lkml'],
        week_start_day: 'monday',
        case_sensitive: false,
        access_grants: [
          {
            name: 'can_view_revenue',
            user_attribute: 'department',
            allowed_values: ['finance', 'executive']
          }
        ]
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 