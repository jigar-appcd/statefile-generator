import { Region } from '@/types/cloud'
import {
    generateGcpProjectId,
    generateRdsInstanceId,
    generateValidPassword
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPSQLDatabaseHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    const instanceId = generateRdsInstanceId(resourceName)
    
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      instance: instanceId,
      project: projectId,
      database_version: 'POSTGRES_14',
      region: region.code,
      settings: {
        tier: 'db-custom-2-4096',
        availability_type: 'REGIONAL',
        disk_size: 10,
        disk_type: 'PD_SSD',
        backup_configuration: {
          enabled: true,
          start_time: '02:00',
          point_in_time_recovery_enabled: true,
          transaction_log_retention_days: 7,
          retained_backups: 7,
          retention_unit: 'COUNT'
        },
        ip_configuration: {
          ipv4_enabled: false,
          require_ssl: true,
          private_network: `projects/${projectId}/global/networks/default`
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
        maintenance_window: {
          day: 7,
          hour: 3,
          update_track: 'stable'
        },
        insights_config: {
          query_insights_enabled: true,
          query_string_length: 1024,
          record_application_tags: true,
          record_client_address: false
        }
      },
      root_password: generateValidPassword(),
      deletion_protection: true,
      labels: {
        environment: 'production'
      }
    }

    return attributes
  }
} 