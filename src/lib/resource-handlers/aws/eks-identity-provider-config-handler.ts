import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateEksClusterId,
    generateEksIdentityProviderId
} from '../base-handler'

export class AWSEKSIdentityProviderConfigHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateEksClusterId()
    const configId = generateEksIdentityProviderId()
    
    const attributes: ResourceAttributes = {
      cluster_name: clusterId,
      oidc: {
        client_id: 'sts.amazonaws.com',
        identity_provider_config_name: resourceName,
        issuer_url: `https://oidc.eks.${region.code}.amazonaws.com/id/${configId}`,
        username_claim: 'sub',
        username_prefix: 'oidc:',
        groups_claim: ['groups'],
        groups_prefix: 'oidc:',
        required_claims: {
          'sts.amazonaws.com': 'true'
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_eks_cluster.${clusterId}`
      ]
    }

    return attributes
  }
} 