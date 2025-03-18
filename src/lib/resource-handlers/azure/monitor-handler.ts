import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureMonitorHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      location: region.code,
      action_group: [
        {
          name: 'critical',
          short_name: 'critical',
          enabled: true,
          email_receiver: [
            {
              name: 'admin',
              email_address: 'admin@example.com',
              use_common_alert_schema: true
            }
          ],
          sms_receiver: [
            {
              name: 'oncall',
              country_code: '1',
              phone_number: '5555555555'
            }
          ],
          webhook_receiver: [
            {
              name: 'teams',
              service_uri: 'https://example.webhook.office.com/webhook/123'
            }
          ]
        }
      ],
      metric_alert: [
        {
          name: 'high-cpu',
          description: 'Alert when CPU usage is high',
          severity: 1,
          enabled: true,
          scopes: ['${azurerm_virtual_machine.main.id}'],
          frequency: 'PT1M',
          window_size: 'PT5M',
          criteria: {
            metric_namespace: 'Microsoft.Compute/virtualMachines',
            metric_name: 'Percentage CPU',
            aggregation: 'Average',
            operator: 'GreaterThan',
            threshold: 90
          },
          action: [
            {
              action_group_id: '${azurerm_monitor_action_group.critical.id}'
            }
          ]
        }
      ],
      scheduled_query_rule: [
        {
          name: 'error-logs',
          description: 'Alert on error logs',
          enabled: true,
          severity: 1,
          frequency: 5,
          time_window: 30,
          action: {
            action_group: ['${azurerm_monitor_action_group.critical.id}'],
            custom_webhook_payload: '{"alert":"{{AlertRuleName}}"}'
          },
          data_source_id: '${azurerm_log_analytics_workspace.main.id}',
          query: 'Event | where EventLevelName == "Error"'
        }
      ],
      diagnostic_setting: [
        {
          name: 'audit',
          target_resource_id: '${azurerm_key_vault.main.id}',
          log_analytics_workspace_id: '${azurerm_log_analytics_workspace.main.id}',
          log: [
            {
              category: 'AuditEvent',
              enabled: true,
              retention_policy: {
                enabled: true,
                days: 30
              }
            }
          ],
          metric: [
            {
              category: 'AllMetrics',
              enabled: true,
              retention_policy: {
                enabled: true,
                days: 30
              }
            }
          ]
        }
      ],
      private_link_scope: [
        {
          name: 'monitoring',
          scope_access: 'Enabled',
          query_access: 'Enabled'
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