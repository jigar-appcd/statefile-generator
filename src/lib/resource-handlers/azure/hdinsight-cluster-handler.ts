import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureHDInsightClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      cluster_version: '4.0',
      tier: 'Standard',
      component_version: {
        hadoop: '3.1',
        spark: '3.1'
      },
      gateway: {
        username: 'adminuser',
        password: '${random_password.hdinsight.result}'
      },
      storage_account: [
        {
          storage_account_key: '${azurerm_storage_account.hdinsight.primary_access_key}',
          storage_container_id: '${azurerm_storage_container.hdinsight.id}',
          is_default: true
        }
      ],
      roles: {
        head_node: {
          vm_size: 'Standard_D3_V2',
          username: 'adminuser',
          password: '${random_password.hdinsight.result}',
          subnet_id: '${azurerm_subnet.hdinsight.id}',
          virtual_network_id: '${azurerm_virtual_network.main.id}'
        },
        worker_node: {
          vm_size: 'Standard_D4_V2',
          username: 'adminuser',
          password: '${random_password.hdinsight.result}',
          target_instance_count: 3,
          subnet_id: '${azurerm_subnet.hdinsight.id}',
          virtual_network_id: '${azurerm_virtual_network.main.id}'
        },
        zookeeper_node: {
          vm_size: 'Standard_D3_V2',
          username: 'adminuser',
          password: '${random_password.hdinsight.result}',
          subnet_id: '${azurerm_subnet.hdinsight.id}',
          virtual_network_id: '${azurerm_virtual_network.main.id}'
        }
      },
      network: {
        connection_direction: 'Inbound',
        private_link_enabled: true
      },
      metastore: {
        hive: {
          database_name: '${azurerm_mssql_database.hive.name}',
          server_name: '${azurerm_mssql_server.metadata.name}',
          username: '${azurerm_mssql_server.metadata.administrator_login}',
          password: '${azurerm_mssql_server.metadata.administrator_login_password}'
        },
        oozie: {
          database_name: '${azurerm_mssql_database.oozie.name}',
          server_name: '${azurerm_mssql_server.metadata.name}',
          username: '${azurerm_mssql_server.metadata.administrator_login}',
          password: '${azurerm_mssql_server.metadata.administrator_login_password}'
        }
      },
      monitor: {
        log_analytics_workspace_id: '${azurerm_log_analytics_workspace.main.workspace_id}',
        primary_key: '${azurerm_log_analytics_workspace.main.primary_shared_key}'
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 