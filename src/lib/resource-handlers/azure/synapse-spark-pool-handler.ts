
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSynapseSparkPoolHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      workspace_name: '${azurerm_synapse_workspace.main.name}',
      node_size_family: 'MemoryOptimized',
      node_size: 'Small',
      cache_size: 100,
      spark_version: '3.3',
      auto_pause: {
        delay_in_minutes: 15
      },
      auto_scale: {
        min_node_count: 3,
        max_node_count: 10
      },
      library_requirement: {
        content: '${file("requirements.txt")}',
        filename: 'requirements.txt'
      },
      spark_config: {
        content: '${file("spark-defaults.conf")}',
        filename: 'spark-defaults.conf'
      },
      custom_libraries: [
        {
          name: 'custom-lib',
          path: 'abfss://libs@${azurerm_storage_account.synapse.name}.dfs.core.windows.net/libs/',
          container_name: 'libs',
          storage_account_name: '${azurerm_storage_account.synapse.name}'
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