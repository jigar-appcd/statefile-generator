
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureFrontDoorHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      routing_rule: [
        {
          name: 'default-rule',
          accepted_protocols: ['Http', 'Https'],
          patterns_to_match: ['/*'],
          frontend_endpoints: ['${resourceName}-frontend'],
          forwarding_configuration: {
            forwarding_protocol: 'MatchRequest',
            backend_pool_name: 'primary-backend'
          }
        }
      ],
      backend_pool_load_balancing: [
        {
          name: 'default-lb',
          sample_size: 4,
          successful_samples_required: 2,
          additional_latency_milliseconds: 0
        }
      ],
      backend_pool_health_probe: [
        {
          name: 'default-probe',
          protocol: 'Https',
          interval_in_seconds: 120,
          path: '/health',
          probe_method: 'HEAD'
        }
      ],
      backend_pool: [
        {
          name: 'primary-backend',
          load_balancing_name: 'default-lb',
          health_probe_name: 'default-probe',
          backend: [
            {
              host_header: '${azurerm_app_service.main.default_site_hostname}',
              address: '${azurerm_app_service.main.default_site_hostname}',
              http_port: 80,
              https_port: 443,
              priority: 1,
              weight: 100
            }
          ]
        }
      ],
      frontend_endpoint: [
        {
          name: '${resourceName}-frontend',
          host_name: '${resourceName}.azurefd.net',
          session_affinity_enabled: true,
          session_affinity_ttl_seconds: 300,
          web_application_firewall_policy_link_id: '${azurerm_frontdoor_firewall_policy.main.id}'
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