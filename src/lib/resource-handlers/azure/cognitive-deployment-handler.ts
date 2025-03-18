
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureCognitiveDeploymentHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      cognitive_account_id: '${azurerm_cognitive_account.main.id}',
      model: {
        format: 'OpenAI',
        name: 'gpt-35-turbo',
        version: '0301'
      },
      scale: {
        type: 'Standard',
        tier: 'Free',
        size: 'S0',
        capacity: 1
      },
      rai_policy_name: 'Default',
      content_filter: {
        severity: 'Medium'
      },
      version_upgrade_option: 'AutoUpgrade',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 