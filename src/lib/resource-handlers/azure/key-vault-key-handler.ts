
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureKeyVaultKeyHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      key_vault_id: '${azurerm_key_vault.main.id}',
      key_type: 'RSA',
      key_size: 2048,
      key_opts: [
        'decrypt',
        'encrypt',
        'sign',
        'unwrapKey',
        'verify',
        'wrapKey'
      ],
      rotation_policy: {
        automatic: {
          time_before_expiry: 'P30D',
          time_after_creation: 'P90D'
        },
        expire_after: 'P180D',
        notify_before_expiry: 'P30D'
      },
      expiration_date: '2025-12-31T23:59:59Z',
      not_before_date: '2023-01-01T00:00:00Z',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 