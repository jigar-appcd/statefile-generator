import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPDataflowHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      template_gcs_path: '${google_storage_bucket.dataflow.name}/templates/template.json',
      temp_gcs_location: '${google_storage_bucket.dataflow.name}/temp',
      zone: `${region.code}-a`,
      network: '${google_compute_network.main.name}',
      subnetwork: '${google_compute_subnetwork.main.name}',
      service_account_email: '${google_service_account.dataflow.email}',
      max_workers: 10,
      parameters: {
        input_subscription: '${google_pubsub_subscription.input.id}',
        output_table: '${google_bigquery_table.output.id}',
        temp_location: '${google_storage_bucket.dataflow.name}/temp',
        streaming: true
      },
      transform_name_mapping: {
        name: 'transform_1',
        env: 'production'
      },
      ip_configuration: 'WORKER_IP_PRIVATE',
      additional_experiments: [
        'enable_stackdriver_agent_metrics',
        'shuffle_mode=service'
      ],
      enable_streaming_engine: true,
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 