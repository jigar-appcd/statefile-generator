import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class OrganizationsAccountHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      email: `aws+${generateResourceId()}@example.com`,
      iam_user_access_to_billing: 'ALLOW',
      role_name: 'OrganizationAccountAccessRole',
      parent_id: '${aws_organizations_organizational_unit.production.id}',
      close_on_deletion: false,
      create_govcloud: false,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_organizations_organizational_unit.production'
      ]
    }

    return attributes
  }
} 