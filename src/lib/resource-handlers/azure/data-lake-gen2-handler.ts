
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureDataLakeGen2Handler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      storage_account_id: '${azurerm_storage_account.datalake.id}',
      default_acl: {
        scope: 'access',
        permissions: {
          owner: 'rwx',
          group: 'r-x',
          other: '---'
        }
      },
      hierarchical_enabled: true,
      ace: [
        {
          scope: 'access',
          type: 'user',
          id: '${data.azuread_service_principal.analytics.object_id}',
          permissions: {
            read: true,
            write: true,
            execute: true
          }
        },
        {
          scope: 'default',
          type: 'group',
          id: '${data.azuread_group.data_scientists.object_id}',
          permissions: {
            read: true,
            write: false,
            execute: true
          }
        }
      ],
      properties: {
        last_modified_time: null,
        has_immutability_policy: false,
        has_legal_hold: false
      },
      lifecycle_rules: [
        {
          name: 'archive-old-data',
          enabled: true,
          filters: {
            prefix_match: ['archive/'],
            blob_types: ['blockBlob']
          },
          actions: {
            base_blob: {
              tier_to_cool_after_days: 30,
              tier_to_archive_after_days: 90,
              delete_after_days: 365
            }
          }
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