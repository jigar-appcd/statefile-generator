import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPNotebooksRuntimeHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      project: '${data.google_project.current.project_id}',
      access_config: {
        runtime_owner: '${data.google_service_account.notebooks.email}',
        runtime_access_type: 'SINGLE_USER'
      },
      software_config: {
        idle_shutdown: true,
        idle_shutdown_timeout: 180,
        install_gpu_driver: false,
        custom_gpu_driver_path: '',
        post_startup_script: '${google_storage_bucket_object.startup_script.name}',
        post_startup_script_behavior: 'DOWNLOAD_AND_RUN_EVERY_START'
      },
      virtual_machine: {
        instance_name: resourceName.toLowerCase(),
        instance_owner_type: 'SINGLE_USER',
        virtual_machine_config: {
          machine_type: 'n1-standard-4',
          data_disk: {
            initialize_params: {
              disk_size_gb: 100,
              disk_type: 'PD_STANDARD'
            }
          },
          container_images: [
            {
              repository: 'gcr.io/deeplearning-platform-release/base-cpu',
              tag: 'latest'
            }
          ],
          encryption_config: {
            kms_key: '${google_kms_crypto_key.notebooks.id}'
          }
        },
        network: '${google_compute_network.main.id}',
        subnet: '${google_compute_subnetwork.main.id}',
        no_public_ip: true,
        no_proxy_access: false,
        service_account: '${google_service_account.notebooks.email}',
        boot_disk_type: 'PD_STANDARD',
        boot_disk_size_gb: 50,
        data_disk_type: 'PD_STANDARD',
        data_disk_size_gb: 100,
        metadata: {
          'proxy-mode': 'service_account',
          'terraform-managed': 'true'
        },
        shielded_instance_config: {
          enable_secure_boot: true,
          enable_vtpm: true,
          enable_integrity_monitoring: true
        }
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_compute_network.main',
        'google_compute_subnetwork.main',
        'google_kms_crypto_key.notebooks',
        'google_storage_bucket_object.startup_script'
      ]
    }

    return attributes
  }
} 