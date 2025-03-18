import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureWebAppHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      service_plan_id: '${azurerm_service_plan.main.id}',
      site_config: {
        always_on: true,
        application_stack: {
          node_version: '18-lts'
        },
        health_check_path: '/health',
        http2_enabled: true,
        minimum_tls_version: '1.2',
        scm_minimum_tls_version: '1.2',
        vnet_route_all_enabled: true,
        worker_count: 3,
        application_insights_connection_string: '${azurerm_application_insights.main.connection_string}',
        application_insights_key: '${azurerm_application_insights.main.instrumentation_key}'
      },
      app_settings: {
        WEBSITE_NODE_DEFAULT_VERSION: '~18',
        WEBSITE_RUN_FROM_PACKAGE: '1',
        NODE_ENV: 'production'
      },
      auth_settings: {
        enabled: true,
        default_provider: 'AzureActiveDirectory',
        active_directory: {
          client_id: '${azuread_application.web.application_id}',
          client_secret: '${azuread_application_password.web.value}'
        }
      },
      connection_string: [
        {
          name: 'Database',
          type: 'SQLAzure',
          value: '${azurerm_mssql_database.main.connection_string}'
        }
      ],
      identity: {
        type: 'SystemAssigned'
      },
      logs: {
        application_logs: {
          azure_blob_storage: {
            level: 'Information',
            retention_in_days: 30,
            sas_url: '${azurerm_storage_account.logs.primary_blob_endpoint}${azurerm_storage_container.logs.name}'
          }
        },
        http_logs: {
          file_system: {
            retention_in_days: 30,
            retention_in_mb: 100
          }
        }
      },
      backup: {
        name: 'backup',
        enabled: true,
        storage_account_url: '${azurerm_storage_account.backup.primary_blob_endpoint}${azurerm_storage_container.backup.name}${data.azurerm_storage_account_sas.backup.sas}',
        schedule: {
          frequency_interval: 1,
          frequency_unit: 'Day',
          retention_period_days: 30,
          start_time: '2023-01-01T00:00:00Z'
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 