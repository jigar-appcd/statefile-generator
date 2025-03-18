import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureApplicationGatewayHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: {
        name: 'WAF_v2',
        tier: 'WAF_v2',
        capacity: 2
      },
      gateway_ip_configuration: {
        name: 'gateway-ip-configuration',
        subnet_id: '${azurerm_subnet.frontend.id}'
      },
      frontend_ip_configuration: {
        name: 'frontend-ip-configuration',
        public_ip_address_id: '${azurerm_public_ip.gateway.id}'
      },
      frontend_port: {
        name: 'frontend-port',
        port: 443
      },
      backend_address_pool: {
        name: 'backend-pool',
        fqdns: ['${azurerm_app_service.main.default_site_hostname}']
      },
      backend_http_settings: {
        name: 'backend-http-settings',
        cookie_based_affinity: 'Disabled',
        path: '/',
        port: 443,
        protocol: 'Https',
        request_timeout: 60,
        probe_name: 'health-probe'
      },
      http_listener: {
        name: 'https-listener',
        frontend_ip_configuration_name: 'frontend-ip-configuration',
        frontend_port_name: 'frontend-port',
        protocol: 'Https',
        ssl_certificate_name: 'ssl-cert'
      },
      ssl_certificate: {
        name: 'ssl-cert',
        key_vault_secret_id: '${azurerm_key_vault_certificate.gateway.secret_id}'
      },
      probe: {
        name: 'health-probe',
        host: '${azurerm_app_service.main.default_site_hostname}',
        path: '/health',
        interval: 30,
        timeout: 30,
        unhealthy_threshold: 3,
        protocol: 'Https'
      },
      waf_configuration: {
        enabled: true,
        firewall_mode: 'Prevention',
        rule_set_type: 'OWASP',
        rule_set_version: '3.2',
        file_upload_limit_mb: 100,
        request_body_check: true,
        max_request_body_size_kb: 128
      },
      zones: [1, 2, 3],
      enable_http2: true,
      identity: {
        type: 'UserAssigned',
        identity_ids: ['${azurerm_user_assigned_identity.gateway.id}']
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 