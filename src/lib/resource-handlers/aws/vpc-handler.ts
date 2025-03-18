import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class VPCHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    const routeTableId = generateResourceId('rtb')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      cidr_block: '10.0.0.0/16',
      enable_dns_hostnames: true,
      enable_dns_support: true,
      enable_network_address_usage_metrics: true,
      instance_tenancy: 'default',
      ipv6_association_id: '',
      ipv6_cidr_block: '',
      ipv6_cidr_block_network_border_group: region.code,
      ipv6_ipam_pool_id: '',
      ipv6_netmask_length: 0,
      main_route_table_id: routeTableId,
      owner_id: accountId,
      assign_generated_ipv6_cidr_block: false,
      tags: {
        Name: `${resourceName}-${vpcId}`,
        ...commonTags
      },
      tags_all: {
        Name: `${resourceName}-${vpcId}`,
        ...commonTags
      },
      depends_on: [
        `aws_route_table.${routeTableId}`
      ]
    }

    return attributes
  }
} 