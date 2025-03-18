import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPAIPlatformHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: '${data.google_project.current.project_id}',
      location: region.code,
      encryption_spec: {
        kms_key_name: '${google_kms_crypto_key.aiplatform.id}'
      },
      network: '${google_compute_network.main.id}',
      enable_private_service_connect: true,
      model: {
        display_name: `${resourceName}-model`,
        description: 'Production ML model',
        artifact_uri: '${google_storage_bucket.model_artifacts.url}/model',
        container_spec: {
          image_uri: 'gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-3:latest',
          command: ['python', '-m', 'predict'],
          args: ['--model_path', '${google_storage_bucket.model_artifacts.url}/model'],
          env: [
            {
              name: 'MODEL_NAME',
              value: resourceName
            }
          ],
          ports: [
            {
              container_port: 8080
            }
          ],
          predict_route: '/v1/predict',
          health_route: '/v1/health'
        },
        version_aliases: ['production'],
        version_description: 'Production version',
        machine_type: 'n1-standard-4',
        min_replica_count: 1,
        max_replica_count: 10,
        metadata: {
          framework: 'tensorflow',
          framework_version: '2.3',
          python_version: '3.7'
        },
        vpc_network: '${google_compute_network.main.self_link}',
        service_account: '${google_service_account.aiplatform.email}'
      },
      dataset: {
        display_name: `${resourceName}-dataset`,
        metadata_schema_uri: 'gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml',
        data_item_labels: {
          type: 'classification',
          version: '1.0'
        }
      },
      endpoint: {
        display_name: `${resourceName}-endpoint`,
        description: 'Production endpoint',
        traffic_split: {
          'production': 100
        },
        network: '${google_compute_network.main.id}',
        min_node_count: 1,
        max_node_count: 5,
        machine_type: 'n1-standard-4',
        service_account: '${google_service_account.aiplatform.email}',
        enable_access_logging: true,
        enable_container_logging: true,
        private_service_connect_config: {
          enable_private_service_connect: true
        }
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 