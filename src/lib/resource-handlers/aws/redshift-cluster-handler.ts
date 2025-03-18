import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId,
    generateRedshiftClusterId,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSRedshiftClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const clusterId = generateRedshiftClusterId()
    const sgId = generateSecurityGroupId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      cluster_identifier: `${resourceName}-${clusterId}`,
      database_name: resourceName.replace(/-/g, '_'),
      master_username: 'admin',
      master_password: 'REPLACE_WITH_SECURE_PASSWORD',
      node_type: 'dc2.large',
      cluster_type: 'multi-node',
      number_of_nodes: 2,
      cluster_subnet_group_name: `${resourceName}-subnet-group`,
      vpc_security_group_ids: [sgId],
      availability_zone_relocation_enabled: true,
      aqua_configuration_status: 'auto',
      automated_snapshot_retention_period: 7,
      port: 5439,
      publicly_accessible: false,
      encrypted: true,
      kms_key_id: kmsKeyId,
      elastic_ip: null,
      enhanced_vpc_routing: true,
      maintenance_track_name: 'current',
      manual_snapshot_retention_period: 7,
      preferred_maintenance_window: 'Mon:04:00-Mon:05:00',
      skip_final_snapshot: false,
      final_snapshot_identifier: `${resourceName}-final-snapshot`,
      logging: {
        enable: true,
        log_destination_type: 'cloudwatch',
        log_exports: ['connectionlog', 'userlog', 'useractivitylog']
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_redshift_subnet_group.${resourceName}-subnet-group`
      ]
    }

    return attributes
  }
} 