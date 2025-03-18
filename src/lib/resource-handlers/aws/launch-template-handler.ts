import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class LaunchTemplateHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      description: `Launch template for ${resourceName}`,
      default_version: 1,
      update_default_version: true,
      block_device_mappings: [
        {
          device_name: '/dev/xvda',
          ebs: {
            volume_size: 20,
            volume_type: 'gp3',
            encrypted: true,
            delete_on_termination: true,
            iops: 3000,
            throughput: 125
          }
        }
      ],
      capacity_reservation_specification: {
        capacity_reservation_preference: 'open'
      },
      cpu_options: {
        core_count: 2,
        threads_per_core: 2
      },
      credit_specification: {
        cpu_credits: 'unlimited'
      },
      disable_api_termination: false,
      ebs_optimized: true,
      elastic_gpu_specifications: [],
      elastic_inference_accelerator: null,
      enclave_options: {
        enabled: false
      },
      hibernation_options: {
        configured: false
      },
      iam_instance_profile: {
        name: '${aws_iam_instance_profile.default.name}'
      },
      image_id: 'ami-0c55b159cbfafe1f0',
      instance_initiated_shutdown_behavior: 'terminate',
      instance_market_options: null,
      instance_type: 't3.micro',
      kernel_id: null,
      key_name: '${aws_key_pair.default.key_name}',
      license_specification: null,
      metadata_options: {
        http_endpoint: 'enabled',
        http_tokens: 'required',
        http_put_response_hop_limit: 1,
        instance_metadata_tags: 'enabled'
      },
      monitoring: {
        enabled: true
      },
      network_interfaces: [
        {
          associate_public_ip_address: true,
          delete_on_termination: true,
          description: 'Primary network interface',
          device_index: 0,
          security_groups: ['${aws_security_group.default.id}'],
          subnet_id: '${aws_subnet.main.id}'
        }
      ],
      placement: {
        availability_zone: `${region.code}a`,
        group_name: null,
        host_id: null,
        tenancy: 'default',
        spread_domain: null
      },
      ram_disk_id: null,
      security_group_names: null,
      tag_specifications: [
        {
          resource_type: 'instance',
          tags: {
            Name: resourceName,
            ...commonTags
          }
        },
        {
          resource_type: 'volume',
          tags: {
            Name: `${resourceName}-volume`,
            ...commonTags
          }
        }
      ],
      user_data: Buffer.from(`#!/bin/bash
echo "Hello, World!"
`).toString('base64'),
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_security_group.default',
        'aws_subnet.main',
        'aws_iam_instance_profile.default',
        'aws_key_pair.default'
      ]
    }

    return attributes
  }
} 