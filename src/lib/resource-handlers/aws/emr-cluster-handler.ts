import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSEMRClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const sgId = generateResourceId('sg')
    const subnetId = generateResourceId('subnet')
    const kmsKeyId = generateResourceId('key')
    const roleId = generateResourceId('role')
    const logBucketId = generateResourceId('log')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      release_label: 'emr-6.10.0',
      service_role: `arn:aws:iam::${accountId}:role/${resourceName}-service-${roleId}`,
      autoscaling_role: `arn:aws:iam::${accountId}:role/${resourceName}-autoscaling-${roleId}`,
      security_configuration: null,
      scale_down_behavior: 'TERMINATE_AT_TASK_COMPLETION',
      step_concurrency_level: 1,
      termination_protection: false,
      keep_job_flow_alive_when_no_steps: true,
      ebs_root_volume_size: 100,
      custom_ami_id: null,
      master_instance_fleet: {
        name: 'Master',
        target_on_demand_capacity: 1,
        instance_type_configs: [
          {
            instance_type: 'm5.xlarge',
            weighted_capacity: 1
          }
        ]
      },
      core_instance_fleet: {
        name: 'Core',
        target_on_demand_capacity: 2,
        instance_type_configs: [
          {
            instance_type: 'm5.xlarge',
            weighted_capacity: 1
          }
        ]
      },
      ec2_attributes: {
        subnet_id: subnetId,
        emr_managed_master_security_group: sgId,
        emr_managed_slave_security_group: sgId,
        service_access_security_group: sgId,
        instance_profile: `arn:aws:iam::${accountId}:instance-profile/${resourceName}-${roleId}`
      },
      bootstrap_action: [
        {
          name: 'Install Dependencies',
          path: 's3://elasticmapreduce/bootstrap-actions/run-if',
          args: [
            'instance.isMaster=true',
            'echo running on master node'
          ]
        }
      ],
      configurations_json: JSON.stringify([
        {
          Classification: 'spark-defaults',
          Properties: {
            'spark.dynamicAllocation.enabled': 'true',
            'spark.shuffle.service.enabled': 'true'
          }
        }
      ]),
      log_uri: `s3://${logBucketId}/logs/`,
      applications: [
        'Spark',
        'Hive',
        'Pig',
        'Hue',
        'JupyterEnterpriseGateway'
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_iam_role.${roleId}`,
        `aws_s3_bucket.${logBucketId}`
      ]
    }

    return attributes
  }
} 