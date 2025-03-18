import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureDatabricksWorkspaceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: 'premium',
      managed_resource_group_name: `${resourceName}-managed-rg`,
      custom_parameters: {
        no_public_ip: true,
        virtual_network_id: '${azurerm_virtual_network.main.id}',
        private_subnet_name: '${azurerm_subnet.private.name}',
        public_subnet_name: '${azurerm_subnet.public.name}',
        public_subnet_network_security_group_association_id: '${azurerm_subnet_network_security_group_association.public.id}',
        private_subnet_network_security_group_association_id: '${azurerm_subnet_network_security_group_association.private.id}'
      },
      infrastructure_encryption_enabled: true,
      customer_managed_key_enabled: true,
      customer_managed_key: {
        key_vault_key_id: '${azurerm_key_vault_key.databricks.id}',
        identity_id: '${azurerm_user_assigned_identity.databricks.id}'
      },
      public_network_access_enabled: false,
      network_security_group_rules_required: 'NoAzureDatabricksRules',
      load_balancer_backend_address_pool_id: '${azurerm_lb_backend_address_pool.databricks.id}',
      managed_services_cmk_key_vault_key_id: '${azurerm_key_vault_key.managed_services.id}',
      identity: {
        type: 'SystemAssigned, UserAssigned',
        identity_ids: ['${azurerm_user_assigned_identity.databricks.id}']
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 