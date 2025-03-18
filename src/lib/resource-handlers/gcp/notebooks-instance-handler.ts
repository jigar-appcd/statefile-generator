import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPNotebooksInstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      project: '${data.google_project.current.project_id}',
      machine_type: 'n1-standard-4',
      vm_image: {
        project: 'deeplearning-platform-release',
        image_family: 'tf2-ent-2-6-cpu'
      },
      instance_owners: ['${data.google_service_account.notebooks.email}'],
      service_account: {
        email: '${google_service_account.notebooks.email}',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      },
      install_gpu_driver: false,
      boot_disk_type: 'PD_SSD',
      boot_disk_size_gb: 100,
      data_disk_type: 'PD_BALANCED',
      data_disk_size_gb: 100,
      no_public_ip: true,
      no_proxy_access: false,
      network: '${google_compute_network.main.id}',
      subnet: '${google_compute_subnetwork.main.id}',
      metadata: {
        'proxy-mode': 'service_account',
        'terraform-managed': 'true'
      },
      shielded_instance_config: {
        enable_secure_boot: true,
        enable_vtpm: true,
        enable_integrity_monitoring: true
      },
      accelerator_config: {
        core_count: '1',
        type: 'NVIDIA_TESLA_T4'
      },
      post_startup_script: '${google_storage_bucket_object.post_startup.name}',
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_compute_network.main',
        'google_compute_subnetwork.main',
        'google_service_account.notebooks',
        'google_storage_bucket_object.post_startup'
      ]
    }

    return attributes
  }
} 