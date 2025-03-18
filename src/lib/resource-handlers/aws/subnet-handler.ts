import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateAccountId } from '../base-handler'

export class SubnetHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      vpc_id: '${aws_vpc.main.id}',
      cidr_block: '10.0.1.0/24',
      availability_zone: `${region.code}a`,
      availability_zone_id: `${region.code}a-1`,
      map_public_ip_on_launch: true,
      owner_id: generateAccountId(),
      enable_dns64: false,
      enable_resource_name_dns_aaaa_record_on_launch: false,
      enable_resource_name_dns_a_record_on_launch: false,
      ipv6_cidr_block: '',
      ipv6_cidr_block_association_id: '',
      ipv6_native: false,
      private_dns_hostname_type_on_launch: 'ip-name',
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