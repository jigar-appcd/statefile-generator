
import {
    generateResourceId,
    generateValidPassword
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureSynapseSQLPoolHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const poolId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const workspaceId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `sqlpool-${poolId}`,
      resource_group_name: `rg-synapse-${resourceGroupId}`,
      workspace_name: `synws-${workspaceId}`,
      collation: 'SQL_Latin1_General_CP1_CI_AS',
      create_mode: 'Default',
      data_encrypted: true,
      sku_name: 'DW1000c',
      storage_account_type: 'GRS',
      geo_backup_policy_enabled: true,
      auto_pause_delay_in_minutes: 60,
      recovery_database_id: null,
      restore_point_in_time: null,
      maintenance_configuration_name: 'SQL_Default',
      storage_account: {
        replication: 'GRS',
        type: 'V2'
      },
      administrator_login: 'sqladmin',
      administrator_login_password: generateValidPassword(),
      transparent_data_encryption: {
        enabled: true,
        identity_based: true
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_synapse_workspace.${workspaceId}`
      ]
    }

    return attributes
  }
} 