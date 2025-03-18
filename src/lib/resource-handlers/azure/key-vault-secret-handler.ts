
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureKeyVaultSecretHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      key_vault_id: '${azurerm_key_vault.main.id}',
      value: '${random_password.secret.result}',
      content_type: 'password',
      not_before_date: null,
      expiration_date: null,
      version: '1',
      versionless_id: '${azurerm_key_vault.main.id}/secrets/${resourceName}',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      timeouts: {
        create: '30m',
        read: '5m',
        update: '30m',
        delete: '30m'
      }
    }

    return attributes
  }
} 