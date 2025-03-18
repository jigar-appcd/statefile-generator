import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureLoadBalancerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: 'Standard',
      sku_tier: 'Regional',
      frontend_ip_configuration: [
        {
          name: 'public-ip',
          public_ip_address_id: '${azurerm_public_ip.lb.id}',
          zones: ['1', '2', '3']
        },
        {
          name: 'private-ip',
          subnet_id: '${azurerm_subnet.internal.id}',
          private_ip_address_allocation: 'Static',
          private_ip_address: '10.0.1.10',
          zones: ['1', '2', '3']
        }
      ],
      backend_address_pool: [
        {
          name: 'web-pool',
          tunnel_interface: [
            {
              identifier: 800,
              type: 'Internal',
              protocol: 'VXLAN'
            }
          ]
        }
      ],
      probe: [
        {
          name: 'http-probe',
          protocol: 'Http',
          port: 80,
          request_path: '/health',
          interval_in_seconds: 15,
          number_of_probes: 2
        }
      ],
      rule: [
        {
          name: 'http-rule',
          protocol: 'Tcp',
          frontend_port: 80,
          backend_port: 80,
          frontend_ip_configuration_name: 'public-ip',
          backend_address_pool_ids: ['${azurerm_lb_backend_address_pool.web.id}'],
          probe_id: '${azurerm_lb_probe.http.id}',
          enable_floating_ip: false,
          idle_timeout_in_minutes: 4,
          enable_tcp_reset: true
        }
      ],
      nat_rule: [
        {
          name: 'ssh-nat',
          protocol: 'Tcp',
          frontend_port: 22,
          backend_port: 22,
          frontend_ip_configuration_name: 'public-ip',
          idle_timeout_in_minutes: 4,
          enable_floating_ip: false,
          enable_tcp_reset: true
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