import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPKubernetesEngineHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      network: '${google_compute_network.main.name}',
      subnetwork: '${google_compute_subnetwork.main.name}',
      networking_mode: 'VPC_NATIVE',
      enable_autopilot: false,
      remove_default_node_pool: true,
      initial_node_count: 1,
      release_channel: {
        channel: 'REGULAR'
      },
      workload_identity_config: {
        workload_pool: '${data.google_project.project.project_id}.svc.id.goog'
      },
      private_cluster_config: {
        enable_private_nodes: true,
        enable_private_endpoint: false,
        master_ipv4_cidr_block: '172.16.0.0/28',
        master_global_access_config: {
          enabled: true
        }
      },
      ip_allocation_policy: {
        cluster_secondary_range_name: 'pods',
        services_secondary_range_name: 'services'
      },
      master_authorized_networks_config: {
        cidr_blocks: [
          {
            cidr_block: '10.0.0.0/8',
            display_name: 'internal'
          }
        ]
      },
      addons_config: {
        http_load_balancing: {
          disabled: false
        },
        horizontal_pod_autoscaling: {
          disabled: false
        },
        network_policy_config: {
          disabled: false
        },
        gcp_filestore_csi_driver_config: {
          enabled: true
        },
        gce_persistent_disk_csi_driver_config: {
          enabled: true
        }
      },
      network_policy: {
        enabled: true,
        provider: 'CALICO'
      },
      cluster_autoscaling: {
        enabled: true,
        resource_limits: [
          {
            resource_type: 'cpu',
            minimum: 1,
            maximum: 100
          },
          {
            resource_type: 'memory',
            minimum: 2,
            maximum: 200
          }
        ],
        auto_provisioning_defaults: {
          disk_size: 100,
          disk_type: 'pd-standard',
          image_type: 'COS_CONTAINERD',
          service_account: '${google_service_account.gke.email}',
          oauth_scopes: [
            'https://www.googleapis.com/auth/cloud-platform'
          ]
        }
      },
      maintenance_policy: {
        recurring_window: {
          start_time: '2022-01-01T09:00:00Z',
          end_time: '2022-01-01T17:00:00Z',
          recurrence: 'FREQ=WEEKLY;BYDAY=SA,SU'
        }
      },
      resource_usage_export_config: {
        enable_network_egress_metering: true,
        enable_resource_consumption_metering: true,
        bigquery_destination: {
          dataset_id: '${google_bigquery_dataset.gke_usage.dataset_id}'
        }
      },
      vertical_pod_autoscaling: {
        enabled: true
      },
      database_encryption: {
        state: 'ENCRYPTED',
        key_name: '${google_kms_crypto_key.gke.id}'
      },
      monitoring_config: {
        enable_components: ['SYSTEM_COMPONENTS', 'WORKLOADS'],
        managed_prometheus: {
          enabled: true
        }
      },
      logging_config: {
        enable_components: ['SYSTEM_COMPONENTS', 'WORKLOADS']
      },
      binary_authorization: {
        evaluation_mode: 'PROJECT_SINGLETON_POLICY_ENFORCE'
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 