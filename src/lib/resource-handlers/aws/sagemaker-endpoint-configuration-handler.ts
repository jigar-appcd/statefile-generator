import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId,
    generateResourceId
} from '../base-handler'

export class AWSSageMakerEndpointConfigurationHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const modelId = generateResourceId('model')
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      kms_key_arn: kmsKeyId,
      production_variants: [
        {
          variant_name: 'AllTraffic',
          model_name: modelId,
          initial_instance_count: 1,
          instance_type: 'ml.t3.medium',
          initial_variant_weight: 1.0,
          serverless_config: null,
          accelerator_type: null
        }
      ],
      async_inference_config: null,
      data_capture_config: {
        enable_capture: true,
        initial_sampling_percentage: 100,
        destination_s3_uri: 'REPLACE_WITH_S3_URI',
        kms_key_id: kmsKeyId,
        capture_options: [
          {
            capture_mode: 'Input'
          },
          {
            capture_mode: 'Output'
          }
        ],
        capture_content_type_header: {
          json_content_types: ['application/json']
        }
      },
      shadow_production_variants: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_sagemaker_model.${modelId}`,
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 