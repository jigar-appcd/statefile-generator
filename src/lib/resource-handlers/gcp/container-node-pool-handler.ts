import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPContainerNodePoolHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      cluster: '${google_container_cluster.main.name}',
      node_count: 3,
      initial_node_count: 1,
      version: '${google_container_cluster.main.min_master_version}',
      max_pods_per_node: 110,
      node_config: {
        machine_type: 'e2-standard-4',
        disk_size_gb: 100,
        disk_type: 'pd-standard',
        image_type: 'COS_CONTAINERD',
        local_ssd_count: 0,
        spot: false,
        preemptible: false,
        service_account: '${google_service_account.gke.email}',
        oauth_scopes: [
          'https://www.googleapis.com/auth/cloud-platform'
        ],
        guest_accelerator: [],
        taint: [
          {
            key: 'node-role',
            value: 'worker',
            effect: 'NO_SCHEDULE'
          }
        ],
        metadata: {
          'disable-legacy-endpoints': 'true'
        },
        shielded_instance_config: {
          enable_secure_boot: true,
          enable_integrity_monitoring: true
        },
        workload_metadata_config: {
          mode: 'GKE_METADATA'
        },
        labels: {
          name: resourceName.toLowerCase(),
          ...commonTags
        }
      },
      management: {
        auto_repair: true,
        auto_upgrade: true
      },
      upgrade_settings: {
        max_surge: 1,
        max_unavailable: 0,
        strategy: 'SURGE'
      },
      autoscaling: {
        min_node_count: 1,
        max_node_count: 5,
        location_policy: 'BALANCED'
      },
      network_config: {
        pod_range: 'pods',
        pod_ipv4_cidr_block: '10.1.0.0/16',
        enable_private_nodes: true
      },
      placement_policy: {
        type: 'COMPACT'
      },
      depends_on: [
        'google_container_cluster.main',
        'google_service_account.gke'
      ]
    }

    return attributes
  }
} 