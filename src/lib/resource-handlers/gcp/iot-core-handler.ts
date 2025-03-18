import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPIoTCoreHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: '${data.google_project.current.project_id}',
      location: region.code,
      registry: {
        id: resourceName,
        event_notification_configs: [
          {
            pubsub_topic_name: '${google_pubsub_topic.iot_events.id}',
            subfolder_matches: 'events/'
          }
        ],
        state_notification_config: {
          pubsub_topic_name: '${google_pubsub_topic.iot_state.id}'
        },
        mqtt_config: {
          mqtt_enabled_state: 'MQTT_ENABLED'
        },
        http_config: {
          http_enabled_state: 'HTTP_ENABLED'
        },
        log_level: 'INFO',
        credentials: [
          {
            public_key_certificate: {
              format: 'X509_CERTIFICATE_PEM',
              certificate: '${file("certs/iot.pem")}'
            }
          }
        ]
      },
      device: {
        id: `${resourceName}-device`,
        blocked: false,
        credentials: [
          {
            public_key: {
              format: 'RSA_PEM',
              key: '${file("certs/device.pem")}'
            }
          }
        ],
        metadata: {
          device_type: 'sensor',
          location: region.code
        },
        config: {
          version: 1,
          cloud_update_time: '2023-01-01T00:00:00.000Z',
          device_ack_time: '2023-01-01T00:00:00.000Z',
          binary_data: 'base64-encoded-config'
        },
        gateway_config: {
          gateway_type: 'NON_GATEWAY',
          gateway_auth_method: 'ASSOCIATION_ONLY'
        }
      },
      gateway: {
        id: `${resourceName}-gateway`,
        credentials: [
          {
            public_key: {
              format: 'RSA_X509_PEM',
              key: '${file("certs/gateway.pem")}'
            }
          }
        ],
        gateway_config: {
          gateway_type: 'GATEWAY',
          gateway_auth_method: 'ASSOCIATION_AND_DEVICE_AUTH_TOKEN',
          last_accessed_gateway_id: '',
          last_accessed_gateway_time: ''
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