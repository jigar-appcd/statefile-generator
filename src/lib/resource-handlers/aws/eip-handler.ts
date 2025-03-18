import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class EIPHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      vpc: true,
      instance: null,
      network_interface: null,
      associate_with_private_ip: null,
      public_ipv4_pool: 'amazon',
      customer_owned_ipv4_pool: null,
      domain: 'vpc',
      network_border_group: null,
      public_dns: true,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 