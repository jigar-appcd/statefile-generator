import { Region } from '@/types/cloud'
import {
    generateGcpNetworkName,
    generateGcpProjectId,
    generateGcpServiceAccountEmail,
    generateResourceId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPCloudSearchHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    const sourceId = generateResourceId()
    const queueId = generateResourceId()
    const networkName = generateGcpNetworkName('search')
    const identitySourceId = generateResourceId()
    const serviceAccount = generateGcpServiceAccountEmail()
    const privateKey = generateResourceId()
    
    const attributes: ResourceAttributes = {
      project: projectId,
      location: region.code,
      data_source: {
        name: `${resourceName}-source-${sourceId}`,
        display_name: `${resourceName} Source`,
        short_name: resourceName.toLowerCase(),
        indexing_service_account: serviceAccount,
        service_account_key: privateKey,
        queue_name: `search-queue-${queueId}`,
        scoring_config: {
          fresh_boost: 1.0,
          importance_boost: 2.0
        },
        indexing_config: {
          mode: 'SYNCHRONOUS',
          params: {
            quality_score: 0.8,
            freshness_days: 180
          }
        },
        attribution_config: {
          owner_attribute: 'owner',
          group_attribute: 'group'
        }
      },
      search_application: {
        name: `${resourceName}-app-${sourceId}`,
        display_name: resourceName,
        data_sources: [`${resourceName}-source-${sourceId}`],
        search_quality_config: {
          quality_factor: 0.8
        },
        source_config: {
          source: `${resourceName}-source-${sourceId}`,
          scoring_config: {
            fresh_boost: 1.0,
            importance_boost: 2.0
          }
        },
        default_collection: 'default',
        serving_config: {
          network: networkName,
          serving_options: {
            search_service: true,
            suggestion_service: true
          }
        },
        identity_config: {
          identity_source_id: `identity-source-${identitySourceId}`,
          group_settings: {
            max_groups_per_identity: 100
          }
        }
      },
      depends_on: [
        `google_cloudsearch_datasource.${sourceId}`,
        `google_compute_network.${networkName}`,
        `google_cloud_identity_source.${identitySourceId}`
      ]
    }

    return attributes
  }
} 