import { Region } from '@/types/cloud'
import {
    generateResourceId,
    generateSubscriptionId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureKubernetesServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const subscriptionId = generateSubscriptionId()
    const subnetId = generateResourceId()
    const workspaceId = generateResourceId()
    const vnetId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `aks-${clusterId}`,
      resource_group_name: `rg-aks-${resourceGroupId}`,
      location: region.code,
      dns_prefix: `aks-${clusterId}`,
      kubernetes_version: '1.26',
      private_cluster_enabled: true,
      sku_tier: 'Standard',
      automatic_channel_upgrade: 'stable',
      default_node_pool: {
        name: 'default',
        node_count: 3,
        vm_size: 'Standard_D2s_v3',
        os_disk_size_gb: 128,
        os_disk_type: 'Managed',
        type: 'VirtualMachineScaleSets',
        enable_auto_scaling: true,
        min_count: 1,
        max_count: 5,
        max_pods: 110,
        vnet_subnet_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-aks-${resourceGroupId}/providers/Microsoft.Network/virtualNetworks/vnet-${vnetId}/subnets/snet-${subnetId}`,
        zones: ['1', '2', '3'],
        node_labels: {
          'environment': 'production',
          'nodepool-type': 'system',
          'node-type': 'worker'
        },
        node_taints: []
      },
      identity: {
        type: 'SystemAssigned'
      },
      network_profile: {
        network_plugin: 'azure',
        network_policy: 'azure',
        dns_service_ip: '10.0.0.10',
        docker_bridge_cidr: '172.17.0.1/16',
        service_cidr: '10.0.0.0/16',
        load_balancer_sku: 'standard',
        outbound_type: 'userDefinedRouting'
      },
      addon_profile: {
        oms_agent: {
          enabled: true,
          log_analytics_workspace_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-aks-${resourceGroupId}/providers/Microsoft.OperationalInsights/workspaces/law-${workspaceId}`
        },
        azure_policy: {
          enabled: true
        },
        ingress_application_gateway: {
          enabled: true,
          gateway_name: 'aks-agw',
          subnet_cidr: '10.2.0.0/24'
        }
      },
      auto_scaler_profile: {
        balance_similar_node_groups: true,
        expander: 'random',
        max_graceful_termination_sec: 600,
        max_node_provisioning_time: '15m',
        max_unready_nodes: 3,
        max_unready_percentage: 45,
        new_pod_scale_up_delay: '10s',
        scale_down_delay_after_add: '10m',
        scale_down_delay_after_delete: '10s',
        scale_down_delay_after_failure: '3m',
        scan_interval: '10s',
        scale_down_unneeded: '10m',
        scale_down_unready: '20m',
        scale_down_utilization_threshold: '0.5'
      },
      maintenance_window: {
        allowed: [
          {
            day: 'Sunday',
            hours: [0, 1, 2]
          }
        ],
        not_allowed: [
          {
            start: '2023-12-24T00:00:00Z',
            end: '2023-12-25T23:59:59Z'
          }
        ]
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_subnet.${subnetId}`,
        `azurerm_log_analytics_workspace.${workspaceId}`,
        `azurerm_virtual_network.${vnetId}`
      ]
    }

    return attributes
  }
} 