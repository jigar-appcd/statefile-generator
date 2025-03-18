import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSynapseFirewallRuleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      workspace_name: '${azurerm_synapse_workspace.main.name}',
      start_ip_address: '10.0.0.0',
      end_ip_address: '10.0.0.255',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 