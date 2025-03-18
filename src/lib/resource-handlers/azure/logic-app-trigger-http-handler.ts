
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureLogicAppTriggerHttpHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      logic_app_id: '${azurerm_logic_app_workflow.main.id}',
      schema: {
        type: 'object',
        properties: {
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'DELETE']
          },
          uri: {
            type: 'string'
          },
          headers: {
            type: 'object'
          },
          queries: {
            type: 'object'
          },
          body: {
            type: 'object'
          }
        },
        required: ['method', 'uri']
      },
      method: 'POST',
      relative_path: 'webhook',
      authentication: {
        type: 'ActiveDirectoryOAuth',
        tenant_id: '${data.azurerm_client_config.current.tenant_id}',
        audience: 'https://management.azure.com',
        identity: {
          type: 'SystemAssigned'
        }
      },
      retry_policy: {
        count: 3,
        interval: 'PT30S',
        type: 'Fixed'
      },
      correlation: {
        client_tracking_id: '${resourceName}-tracking'
      },
      depends_on: [
        'azurerm_logic_app_workflow.main'
      ]
    }

    return attributes
  }
} 