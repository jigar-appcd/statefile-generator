import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPSecretManagerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: '${data.google_project.current.project_id}',
      secret: {
        secret_id: resourceName,
        replication: {
          automatic: true
        },
        topics: [
          {
            name: '${google_pubsub_topic.secrets.name}'
          }
        ],
        rotation: {
          rotation_period: '2592000s',
          next_rotation_time: '2024-01-01T00:00:00Z'
        },
        ttl: '2592000s',
        version: {
          enabled: true,
          create_time: '2023-01-01T00:00:00Z',
          destroy_time: null,
          state: 'ENABLED',
          replication_status: {
            automatic: {
              customer_managed_encryption: {
                kms_key_name: '${google_kms_crypto_key.secrets.id}'
              }
            }
          }
        },
        policy: {
          bindings: [
            {
              role: 'roles/secretmanager.secretAccessor',
              members: [
                'serviceAccount:${google_service_account.app.email}'
              ]
            },
            {
              role: 'roles/secretmanager.admin',
              members: [
                'group:admins@example.com'
              ]
            }
          ]
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