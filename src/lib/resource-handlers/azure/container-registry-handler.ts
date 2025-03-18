import { Region } from '@/types/cloud'
import {
    generateKeyVaultKeyId,
    generateResourceGroupName,
    generateResourceId,
    generateSubscriptionId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureContainerRegistryHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const resourceGroupName = generateResourceGroupName('prod', 'acr')
    const registryId = generateResourceId()
    const subscriptionId = generateSubscriptionId()
    const subnetId = generateResourceId()
    const keyVaultName = `kv-${resourceGroupName}`
    const keyName = `acr-key-${registryId}`
    const identityId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `acr${registryId}`,
      resource_group_name: resourceGroupName,
      location: region.code,
      sku: 'Premium',
      admin_enabled: false,
      public_network_access_enabled: false,
      zone_redundancy_enabled: true,
      network_rule_bypass_option: 'AzureServices',
      network_rule_set: {
        default_action: 'Deny',
        ip_rule: [
          {
            action: 'Allow',
            ip_range: '10.0.0.0/24'
          }
        ],
        virtual_network: [
          {
            action: 'Allow',
            subnet_id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworks/vnet-acr/subnets/${subnetId}`
          }
        ]
      },
      retention_policy: {
        days: 7,
        enabled: true
      },
      trust_policy: {
        enabled: true
      },
      quarantine_policy: {
        enabled: true
      },
      georeplications: [
        {
          location: 'eastus2',
          zone_redundancy_enabled: true,
          tags: {
            environment: 'production'
          }
        }
      ],
      encryption: {
        enabled: true,
        key_vault_key_id: generateKeyVaultKeyId(subscriptionId, resourceGroupName, keyVaultName, keyName),
        identity_client_id: `acr-identity-${identityId}`
      },
      identity: {
        type: 'UserAssigned',
        identity_ids: [`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/acr-identity-${identityId}`]
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupName}`,
        `azurerm_subnet.${subnetId}`,
        `azurerm_key_vault.${keyVaultName}`,
        `azurerm_key_vault_key.${keyName}`,
        `azurerm_user_assigned_identity.acr_identity_${identityId}`
      ]
    }

    return attributes
  }
} 