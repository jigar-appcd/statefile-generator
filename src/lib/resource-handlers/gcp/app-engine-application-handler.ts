import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPAppEngineApplicationHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      location_id: region.code,
      auth_domain: 'gmail.com',
      serving_status: 'SERVING',
      feature_settings: {
        split_health_checks: true
      },
      iap: {
        enabled: true,
        oauth2_client_id: '${google_iap_client.app_engine.client_id}',
        oauth2_client_secret: '${google_iap_client.app_engine.client_secret}'
      },
      database_type: 'CLOUD_FIRESTORE',
      depends_on: [
        'google_iap_client.app_engine'
      ]
    }

    return attributes
  }
} 