import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPAIPlatformModelHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      description: `AI Platform model for ${resourceName}`,
      regions: [region.code],
      online_prediction_logging: true,
      online_prediction_console_logging: true,
      version_aliases: {
        'prod': 'v1'
      },
      default_version: {
        name: 'v1',
        description: 'Initial model version',
        deployment_uri: '${google_storage_bucket.model.url}/model',
        runtime_version: '2.8',
        machine_type: 'n1-standard-4',
        python_version: '3.7',
        framework: 'TENSORFLOW',
        accelerator: {
          type: 'NVIDIA_TESLA_T4',
          count: 1
        },
        service_account_email: '${google_service_account.ai_platform.email}',
        explanation_config: {
          integrated_gradients: {
            num_integral_steps: 50
          },
          xrai: {
            num_trial_samples: 100
          },
          sampled_shapley: {
            num_paths: 50
          }
        },
        auto_scaling_config: {
          min_nodes: 1,
          max_nodes: 5,
          initial_nodes: 1,
          accelerator_count_per_node: 1,
          cpu_utilization_target: 60,
          network_utilization_target: 60,
          min_prediction_batch_size: 8,
          max_prediction_batch_size: 128
        }
      },
      container_spec: {
        image_uri: 'gcr.io/${data.google_project.current.project_id}/model-serving:latest',
        command: ['python', 'serve.py'],
        args: ['--model_path=/models/model.h5'],
        env: [
          {
            name: 'MODEL_NAME',
            value: resourceName
          },
          {
            name: 'MODEL_VERSION',
            value: 'v1'
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
      encryption_spec: {
        kms_key_name: '${google_kms_crypto_key.ai_platform.id}'
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_storage_bucket.model',
        'google_service_account.ai_platform',
        'google_kms_crypto_key.ai_platform'
      ]
    }

    return attributes
  }
} 