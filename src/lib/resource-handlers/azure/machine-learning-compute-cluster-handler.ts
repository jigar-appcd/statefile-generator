import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureMachineLearningComputeClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      machine_learning_workspace_id: '${azurerm_machine_learning_workspace.main.id}',
      vm_priority: 'Dedicated',
      vm_size: 'Standard_DS3_v2',
      identity: {
        type: 'SystemAssigned'
      },
      scale_settings: {
        min_node_count: 0,
        max_node_count: 4,
        scale_down_nodes_after_idle_duration: 'PT30M'
      },
      subnet_resource_id: '${azurerm_subnet.ml_compute.id}',
      remote_login_port_public_access: 'Disabled',
      description: 'Machine Learning compute cluster for training and inference',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 