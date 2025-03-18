import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureDataShareHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const shareId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const sourceDatasetId = generateResourceId()
    const targetDatasetId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `datashare-${shareId}`,
      location: region.code,
      resource_group_name: `rg-datashare-${resourceGroupId}`,
      kind: 'CopyBased',
      identity: {
        type: 'SystemAssigned'
      },
      snapshot_schedule: {
        name: 'daily-snapshot',
        recurrence: 'Day',
        start_time: '00:00',
        recurrence_interval: 1
      },
      share_kind: {
        name: 'Snapshot',
        data_set_mappings: [
          {
            data_set_id: `ds-source-${sourceDatasetId}`,
            target_data_set_id: `ds-target-${targetDatasetId}`
          }
        ]
      },
      synchronization: {
        synchronization_mode: 'Incremental',
        tumbling_window_in_minutes: 1440
      },
      tags: {
        Name: resourceName,
        ...commonTags,
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_data_share_dataset_blob_storage.${sourceDatasetId}`,
        `azurerm_data_share_dataset_blob_storage.${targetDatasetId}`
      ]
    }

    return attributes
  }
} 