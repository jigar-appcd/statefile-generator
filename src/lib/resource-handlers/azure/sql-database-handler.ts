import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSQLDatabaseHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      server_name: '${azurerm_sql_server.main.name}',
      location: region.code,
      edition: 'GeneralPurpose',
      collation: 'SQL_Latin1_General_CP1_CI_AS',
      create_mode: 'Default',
      max_size_gb: 32,
      requested_service_objective_name: 'GP_Gen5_2',
      zone_redundant: true,
      read_scale: true,
      sku_name: 'GP_Gen5_2',
      storage_account_type: 'Geo',
      ledger_enabled: false,
      auto_pause_delay_in_minutes: 60,
      min_capacity: 0.5,
      geo_backup_enabled: true,
      threat_detection_policy: {
        state: 'Enabled',
        email_account_admins: true,
        email_addresses: ['dba@example.com'],
        retention_days: 30,
        disabled_alerts: [],
        storage_endpoint: '${azurerm_storage_account.security.primary_blob_endpoint}',
        storage_account_access_key: '${azurerm_storage_account.security.primary_access_key}'
      },
      short_term_retention_policy: {
        retention_days: 7,
        backup_interval_in_hours: 12
      },
      long_term_retention_policy: {
        weekly_retention: 'P4W',
        monthly_retention: 'P12M',
        yearly_retention: 'P5Y',
        week_of_year: 1
      },
      maintenance_configuration_name: 'SQL_Default',
      elastic_pool_id: '${azurerm_mssql_elastic_pool.main.id}',
      license_type: 'BasePrice',
      transparent_data_encryption_enabled: true,
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 