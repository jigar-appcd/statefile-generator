import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, generateResourceId } from '../base-handler'

export class GCPComputeInstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateResourceId('project')
    const networkId = generateResourceId('network')
    const subnetId = generateResourceId('subnet')
    const bootDiskId = generateResourceId('disk')
    const dataDiskId = generateResourceId('disk')
    const serviceAccountId = generateResourceId('sa')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      machine_type: 'n1-standard-2',
      zone: region.code,
      boot_disk: {
        initialize_params: {
          image: 'debian-cloud/debian-11',
          size: 50,
          type: 'pd-ssd'
        },
        auto_delete: true,
        device_name: bootDiskId
      },
      attached_disk: {
        source: dataDiskId,
        device_name: 'data-disk',
        mode: 'READ_WRITE'
      },
      network_interface: {
        network: `projects/${projectId}/global/networks/${networkId}`,
        subnetwork: `projects/${projectId}/regions/${region.code}/subnetworks/${subnetId}`,
        access_config: {
          nat_ip: '',
          network_tier: 'PREMIUM'
        }
      },
      metadata: {
        'startup-script': '#!/bin/bash\necho "Hello, World!"'
      },
      service_account: {
        email: `${serviceAccountId}@${projectId}.iam.gserviceaccount.com`,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      },
      allow_stopping_for_update: true,
      labels: {
        environment: 'production',
        name: resourceName
      },
      scheduling: {
        preemptible: false,
        automatic_restart: true,
        on_host_maintenance: 'MIGRATE'
      }
    }

    return attributes
  }
} 