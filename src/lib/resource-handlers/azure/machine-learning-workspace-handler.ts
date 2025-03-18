import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureMachineLearningWorkspaceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      application_insights_id: '${azurerm_application_insights.ml.id}',
      key_vault_id: '${azurerm_key_vault.ml.id}',
      storage_account_id: '${azurerm_storage_account.ml.id}',
      container_registry_id: '${azurerm_container_registry.ml.id}',
      public_network_access_enabled: false,
      v1_legacy_mode_enabled: false,
      high_business_impact: true,
      description: 'Machine Learning Workspace for AI/ML workloads',
      friendly_name: `${resourceName} ML Workspace`,
      encryption: {
        key_vault_id: '${azurerm_key_vault.ml.id}',
        key_id: '${azurerm_key_vault_key.ml.id}'
      },
      identity: {
        type: 'SystemAssigned'
      },
      primary_user_assigned_identity: '${azurerm_user_assigned_identity.ml.id}',
      image_build_compute_name: 'image-builder',
      sku_name: 'Enterprise',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 