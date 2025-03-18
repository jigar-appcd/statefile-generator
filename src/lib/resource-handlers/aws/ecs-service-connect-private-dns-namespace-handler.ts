import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectPrivateDNSNamespaceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    const namespaceId = generateResourceId('namespace')

    const attributes: ResourceAttributes = {
      name: `${resourceName}-${namespaceId}`,
      vpc: vpcId,
      description: 'Private DNS namespace for ECS Service Connect',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`
      ]
    }

    return attributes
  }
} 