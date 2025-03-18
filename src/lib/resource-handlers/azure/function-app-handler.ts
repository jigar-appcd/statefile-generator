import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureFunctionAppHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      service_plan_id: '${azurerm_service_plan.main.id}',
      storage_account_name: '${azurerm_storage_account.main.name}',
      storage_account_access_key: '${azurerm_storage_account.main.primary_access_key}',
      os_type: 'linux',
      version: '~4',
      https_only: true,
      enabled: true,
      functions_extension_version: '~4',
      site_config: {
        always_on: true,
        app_scale_limit: 10,
        elastic_instance_minimum: 1,
        health_check_path: '/health',
        http2_enabled: true,
        application_stack: {
          node_version: '18'
        },
        application_insights_enabled: true,
        application_insights_key: '${azurerm_application_insights.main.instrumentation_key}',
        cors: {
          allowed_origins: ['*'],
          support_credentials: false
        },
        use_32_bit_worker: false,
        websockets_enabled: false,
        minimum_tls_version: '1.2',
        scm_minimum_tls_version: '1.2',
        vnet_route_all_enabled: true
      },
      app_settings: {
        FUNCTIONS_WORKER_RUNTIME: 'node',
        WEBSITE_NODE_DEFAULT_VERSION: '~18',
        WEBSITE_RUN_FROM_PACKAGE: '1',
        FUNCTIONS_WORKER_PROCESS_COUNT: '4',
        AzureWebJobsDisableHomepage: 'true',
        WEBSITE_TIME_ZONE: 'UTC'
      },
      identity: {
        type: 'SystemAssigned'
      },
      connection_string: [
        {
          name: 'Database',
          type: 'SQLAzure',
          value: '${azurerm_sql_database.main.connection_string}'
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