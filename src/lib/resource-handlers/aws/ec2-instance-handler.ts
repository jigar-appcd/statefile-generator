import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class EC2InstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region, index: number = 0): ResourceAttributes {
    const attributes: ResourceAttributes = {
      ami: 'ami-005e54dee72cc1d00',
      instance_type: 't2.micro',
      availability_zone: `${region.code}a`,
      subnet_id: '${aws_subnet.main.id}',
      vpc_security_group_ids: ['${aws_security_group.default.id}'],
      associate_public_ip_address: true,
      private_ip: `10.0.1.${Math.floor(Math.random() * 254) + 1}`,
      secondary_private_ips: [],
      ipv6_addresses: [],
      ebs_optimized: false,
      root_block_device: {
        delete_on_termination: true,
        encrypted: false,
        iops: 3000,
        throughput: 125,
        volume_size: 20,
        volume_type: 'gp3',
        tags: {
          Name: `${resourceName}-root`
        }
      },
      ebs_block_device: [
        {
          device_name: '/dev/sdf',
          delete_on_termination: true,
          encrypted: true,
          iops: 3000,
          throughput: 125,
          volume_size: 100,
          volume_type: 'gp3',
          tags: {
            Name: `${resourceName}-data`
          }
        }
      ],
      network_interface: [
        {
          network_interface_id: '${aws_network_interface.main.id}',
          device_index: 0
        }
      ],
      credit_specification: {
        cpu_credits: 'unlimited'
      },
      metadata_options: {
        http_endpoint: 'enabled',
        http_tokens: 'required',
        http_put_response_hop_limit: 1,
        instance_metadata_tags: 'enabled'
      },
      monitoring: true,
      tenancy: 'default',
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