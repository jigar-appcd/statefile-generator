import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSGlueConnectionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const sgId = generateSecurityGroupId()
    const subnetId = generateSubnetId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      description: `Glue connection for ${resourceName}`,
      connection_type: 'JDBC',
      match_criteria: [],
      physical_connection_requirements: {
        availability_zone: 'us-west-2a',
        security_group_id_list: [sgId],
        subnet_id: subnetId
      },
      connection_properties: {
        JDBC_CONNECTION_URL: 'jdbc:postgresql://host:5432/database',
        USERNAME: 'REPLACE_WITH_USERNAME',
        PASSWORD: 'REPLACE_WITH_PASSWORD'
      },
      catalog_id: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId}`
      ]
    }

    return attributes
  }
} 