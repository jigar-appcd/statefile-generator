import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPPubSubHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      topic: {
        name: `${resourceName}-topic`,
        kms_key_name: '${google_kms_crypto_key.pubsub.id}',
        message_retention_duration: '604800s', // 7 days
        message_storage_policy: {
          allowed_persistence_regions: [region.code]
        },
        schema_settings: {
          schema: '${google_pubsub_schema.events.id}',
          encoding: 'JSON'
        },
        subscription: [
          {
            name: `${resourceName}-subscription`,
            message_retention_duration: '604800s',
            retain_acked_messages: true,
            ack_deadline_seconds: 20,
            enable_message_ordering: true,
            expiration_policy: {
              ttl: '2592000s' // 30 days
            },
            retry_policy: {
              minimum_backoff: '10s',
              maximum_backoff: '600s'
            },
            dead_letter_policy: {
              dead_letter_topic: '${google_pubsub_topic.dead_letter.id}',
              max_delivery_attempts: 5
            },
            push_config: {
              push_endpoint: 'https://example.com/push',
              attributes: {
                'x-goog-version': 'v1'
              },
              oidc_token: {
                service_account_email: '${google_service_account.pubsub.email}'
              }
            },
            bigquery_config: {
              table: '${google_bigquery_table.events.id}',
              use_topic_schema: true,
              write_metadata: true
            },
            cloud_storage_config: {
              bucket: '${google_storage_bucket.archive.name}',
              filename_prefix: 'events/',
              filename_suffix: '.json',
              max_duration: '300s',
              max_bytes: 104857600 // 100MB
            }
          }
        ]
      },
      schema: {
        name: `${resourceName}-schema`,
        type: 'AVRO',
        definition: `
          {
            "type": "record",
            "name": "Event",
            "fields": [
              {"name": "id", "type": "string"},
              {"name": "timestamp", "type": "long"},
              {"name": "data", "type": "string"}
            ]
          }
        `
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 