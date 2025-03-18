import { ResourceAttributes } from '@/types/cloud'

export const awsResourceAttributes: Record<string, ResourceAttributes> = {
  // Compute Resources
  aws_instance: {
    provider: 'aws',
    ami: 'ami-0c55b159cbfafe1f0',
    instance_type: 't2.micro',
    subnet_id: '${aws_subnet.main.id}',
    vpc_security_group_ids: ['${aws_security_group.default.id}'],
    key_name: '${var.key_name}',
    associate_public_ip_address: true,
    root_block_device: {
      volume_size: 20,
      volume_type: 'gp2',
      delete_on_termination: true,
    },
    ebs_block_device: [
      {
        device_name: '/dev/sdf',
        volume_size: 100,
        volume_type: 'gp2',
        delete_on_termination: true,
      },
    ],
    tags: {
      Name: '${var.instance_name}',
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_subnet.main',
      'aws_security_group.default'
    ],
  },

  aws_lambda_function: {
    provider: 'aws',
    filename: '${var.lambda_filename}',
    function_name: '${var.lambda_function_name}',
    role: '${aws_iam_role.lambda_execution.arn}',
    handler: '${var.lambda_handler}',
    runtime: 'nodejs18.x',
    memory_size: 128,
    timeout: 3,
    vpc_config: {
      subnet_ids: ['${aws_subnet.lambda_1.id}', '${aws_subnet.lambda_2.id}'],
      security_group_ids: ['${aws_security_group.lambda.id}'],
    },
    environment: {
      variables: {
        NODE_ENV: '${var.environment}',
      },
    },
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_iam_role_policy_attachment.lambda_execution',
      'aws_security_group.lambda'
    ],
  },

  aws_ebs_volume: {
    provider: 'aws',
    availability_zone: 'us-east-1a',
    size: 100,
    type: 'gp3',
    iops: 3000,
    throughput: 125,
    encrypted: true,
    tags: {
      Name: 'example-volume',
    },
  },

  aws_autoscaling_group: {
    provider: 'aws',
    name: '${var.asg_name}',
    max_size: 5,
    min_size: 1,
    desired_capacity: 2,
    health_check_grace_period: 300,
    health_check_type: 'EC2',
    force_delete: true,
    launch_template: {
      id: '${aws_launch_template.default.id}',
      version: '$Latest',
    },
    vpc_zone_identifier: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}'],
    target_group_arns: ['${aws_lb_target_group.default.arn}'],
    tag: [
      {
        key: 'Environment',
        value: '${var.environment}',
        propagate_at_launch: true,
      },
    ],
    depends_on: [
      'aws_launch_template.default',
      'aws_subnet.private_1',
      'aws_subnet.private_2',
      'aws_lb_target_group.default'
    ],
  },

  // Networking Resources
  aws_vpc: {
    provider: 'aws',
    cidr_block: '10.0.0.0/16',
    enable_dns_hostnames: true,
    enable_dns_support: true,
    instance_tenancy: 'default',
    tags: {
      Name: '${var.vpc_name}',
    },
    depends_on: ['aws_security_group.default'],
  },

  aws_subnet: {
    provider: 'aws',
    vpc_id: '${aws_vpc.main.id}',
    cidr_block: '10.0.1.0/24',
    availability_zone: '${var.region}a',
    map_public_ip_on_launch: true,
    tags: {
      Name: '${var.subnet_name}',
    },
    depends_on: [
      'aws_vpc.main',
      'aws_security_group.default'
    ],
  },

  aws_internet_gateway: {
    provider: 'aws',
    vpc_id: '${aws_vpc.main.id}',
    tags: {
      Name: '${var.igw_name}',
    },
    depends_on: ['aws_vpc.main'],
  },

  aws_route_table: {
    provider: 'aws',
    vpc_id: '${aws_vpc.main.id}',
    route: [
      {
        cidr_block: '0.0.0.0/0',
        gateway_id: '${aws_internet_gateway.main.id}',
      },
    ],
    tags: {
      Name: '${var.route_table_name}',
    },
    depends_on: [
      'aws_vpc.main',
      'aws_internet_gateway.main'
    ],
  },

  aws_security_group: {
    provider: 'aws',
    name: '${var.security_group_name}',
    description: 'Security group with configurable rules',
    vpc_id: '${aws_vpc.main.id}',
    ingress: [
      {
        from_port: 443,
        to_port: 443,
        protocol: 'tcp',
        cidr_blocks: ['${var.allowed_cidr}'],
        ipv6_cidr_blocks: ['::/0'],
      }
    ],
    egress: [
      {
        from_port: 0,
        to_port: 0,
        protocol: '-1',
        cidr_blocks: ['0.0.0.0/0'],
        ipv6_cidr_blocks: ['::/0'],
      }
    ],
    tags: {
      Name: '${var.security_group_name}',
    },
    depends_on: ['aws_vpc.main'],
  },

  aws_vpn_gateway: {
    provider: 'aws',
    vpc_id: '${aws_vpc.main.id}',
    amazon_side_asn: '64512',
    tags: {
      Name: '${var.vpn_gateway_name}',
    },
    depends_on: ['aws_vpc.main'],
  },

  aws_lb: {
    provider: 'aws',
    name: '${var.lb_name}',
    internal: false,
    load_balancer_type: 'application',
    security_groups: ['${aws_security_group.alb.id}'],
    subnets: ['${aws_subnet.public_1.id}', '${aws_subnet.public_2.id}'],
    enable_deletion_protection: false,
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_security_group.alb',
      'aws_subnet.public_1',
      'aws_subnet.public_2'
    ],
  },

  // Database Resources
  aws_db_instance: {
    provider: 'aws',
    identifier: '${var.db_identifier}',
    allocated_storage: 20,
    storage_type: 'gp2',
    engine: 'mysql',
    engine_version: '8.0',
    instance_class: 'db.t3.micro',
    username: '${var.db_username}',
    password: '${var.db_password}',
    parameter_group_name: 'default.mysql8.0',
    skip_final_snapshot: true,
    vpc_security_group_ids: ['${aws_security_group.rds.id}'],
    db_subnet_group_name: '${aws_db_subnet_group.default.name}',
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_security_group.rds',
      'aws_db_subnet_group.default'
    ],
  },

  aws_dynamodb_table: {
    provider: 'aws',
    name: '${var.dynamodb_table_name}',
    billing_mode: 'PAY_PER_REQUEST',
    hash_key: 'id',
    stream_enabled: true,
    stream_view_type: 'NEW_AND_OLD_IMAGES',
    server_side_encryption: {
      enabled: true,
      kms_key_arn: '${aws_kms_key.dynamodb.arn}'
    },
    point_in_time_recovery: {
      enabled: true
    },
    attribute: [
      {
        name: 'id',
        type: 'S',
      },
    ],
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: ['aws_kms_key.dynamodb'],
  },

  aws_elasticache_cluster: {
    provider: 'aws',
    cluster_id: '${var.elasticache_cluster_id}',
    engine: 'redis',
    node_type: 'cache.t3.micro',
    num_cache_nodes: 1,
    parameter_group_name: 'default.redis6.x',
    port: 6379,
    subnet_group_name: '${aws_elasticache_subnet_group.default.name}',
    security_group_ids: ['${aws_security_group.elasticache.id}'],
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_elasticache_subnet_group.default',
      'aws_security_group.elasticache'
    ],
  },

  aws_redshift_cluster: {
    provider: 'aws',
    cluster_identifier: '${var.redshift_cluster_id}',
    database_name: '${var.redshift_database_name}',
    master_username: '${var.redshift_username}',
    master_password: '${var.redshift_password}',
    node_type: 'dc2.large',
    cluster_type: 'single-node',
    vpc_security_group_ids: ['${aws_security_group.redshift.id}'],
    cluster_subnet_group_name: '${aws_redshift_subnet_group.default.name}',
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_security_group.redshift',
      'aws_redshift_subnet_group.default'
    ],
  },

  // Storage Resources
  aws_s3_bucket: {
    provider: 'aws',
    bucket: '${var.bucket_name}',
    force_destroy: true,
    versioning: {
      enabled: true,
    },
    server_side_encryption_configuration: {
      rule: {
        apply_server_side_encryption_by_default: {
          sse_algorithm: 'AES256',
        },
      },
    },
    policy: '${data.aws_iam_policy_document.bucket_policy.json}',
    tags: {
      Environment: 'production',
    },
    depends_on: [
      'aws_kms_key.s3'
    ],
  },

  aws_efs_file_system: {
    provider: 'aws',
    creation_token: '${var.efs_creation_token}',
    encrypted: true,
    performance_mode: 'generalPurpose',
    throughput_mode: 'bursting',
    tags: {
      Name: '${var.efs_name}',
      Environment: '${var.environment}',
    },
  },

  aws_efs_mount_target: {
    provider: 'aws',
    file_system_id: '${aws_efs_file_system.default.id}',
    subnet_id: '${aws_subnet.private.id}',
    security_groups: ['${aws_security_group.efs.id}'],
    depends_on: [
      'aws_efs_file_system.default',
      'aws_subnet.private',
      'aws_security_group.efs'
    ],
  },

  // Container Resources
  aws_ecs_cluster: {
    provider: 'aws',
    name: '${var.ecs_cluster_name}',
    setting: [
      {
        name: 'containerInsights',
        value: 'enabled',
      },
    ],
    configuration: {
      execute_command_configuration: {
        kms_key_id: '${aws_kms_key.ecs.arn}',
        logging: 'OVERRIDE',
        log_configuration: {
          cloud_watch_log_group_name: '${aws_cloudwatch_log_group.ecs.name}'
        }
      }
    },
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_kms_key.ecs',
      'aws_cloudwatch_log_group.ecs'
    ],
  },

  aws_ecs_service: {
    name: '${var.service_name}',
    cluster: '${aws_ecs_cluster.main.id}',
    task_definition: '${aws_ecs_task_definition.service.arn}',
    desired_count: '${var.service_desired_count}',
    launch_type: 'FARGATE',
    platform_version: 'LATEST',
    
    network_configuration: {
      subnets: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}'],
      security_groups: ['${aws_security_group.ecs_tasks.id}'],
      assign_public_ip: false
    },

    load_balancer: [{
      target_group_arn: '${aws_lb_target_group.service.arn}',
      container_name: '${var.container_name}',
      container_port: '${var.container_port}'
    }],

    depends_on: [
      'aws_iam_role_policy.ecs_service_role_policy',
      'aws_lb_listener.front_end'
    ]
  },

  aws_eks_cluster: {
    provider: 'aws',
    name: '${var.cluster_name}',
    role_arn: '${aws_iam_role.eks_cluster_role.arn}',
    vpc_config: {
      subnet_ids: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}'],
      security_group_ids: ['${aws_security_group.eks_cluster.id}']
    },
    encryption_config: {
      provider: {
        key_arn: '${aws_kms_key.eks.arn}'
      },
      resources: ['secrets']
    },
    enabled_cluster_log_types: ['api', 'audit', 'authenticator', 'controllerManager', 'scheduler'],
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_iam_role_policy_attachment.eks_cluster_policy',
      'aws_iam_role_policy_attachment.eks_service_policy',
      'aws_kms_key.eks',
      'aws_cloudwatch_log_group.eks'
    ],
  },

  // Security Resources
  aws_iam_role: {
    provider: 'aws',
    name: '${var.role_name}',
    assume_role_policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: ['${var.service_principal}.amazonaws.com']
        }
      }]
    }),
    tags: {
      Environment: '${var.environment}'
    }
  },

  aws_kms_key: {
    provider: 'aws',
    description: '${var.key_description}',
    deletion_window_in_days: 7,
    enable_key_rotation: true,
    policy: '${data.aws_iam_policy_document.kms_key_policy.json}',
    tags: {
      Environment: '${var.environment}'
    }
  },

  // Analytics Resources
  aws_emr_cluster: {
    provider: 'aws',
    name: '${var.emr_cluster_name}',
    release_label: 'emr-6.6.0',
    service_role: '${aws_iam_role.emr_service.arn}',
    applications: ['Spark', 'Hive'],
    instances: {
      master_instance_type: 'm5.xlarge',
      core_instance_type: 'm5.xlarge',
      core_instance_count: 2,
      ec2_subnet_id: '${aws_subnet.private.id}',
      emr_managed_master_security_group: '${aws_security_group.emr_master.id}',
      emr_managed_slave_security_group: '${aws_security_group.emr_slave.id}',
      service_access_security_group: '${aws_security_group.emr_service.id}',
    },
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_iam_role.emr_service',
      'aws_subnet.private',
      'aws_security_group.emr_master',
      'aws_security_group.emr_slave',
      'aws_security_group.emr_service'
    ],
  },

  aws_kinesis_stream: {
    provider: 'aws',
    name: '${var.kinesis_stream_name}',
    shard_count: 1,
    retention_period: 24,
    encryption_type: 'KMS',
    kms_key_id: '${aws_kms_key.kinesis.arn}',
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: ['aws_kms_key.kinesis'],
  },

  aws_kinesis_firehose_delivery_stream: {
    provider: 'aws',
    name: '${var.delivery_stream_name}',
    destination: 'extended_s3',
    extended_s3_configuration: {
      role_arn: '${aws_iam_role.firehose_role.arn}',
      bucket_arn: '${aws_s3_bucket.destination.arn}',
      cloudwatch_logging_options: {
        log_group_name: '${aws_cloudwatch_log_group.firehose.name}'
      }
    },
    depends_on: [
      'aws_iam_role_policy_attachment.firehose_policy',
      'aws_s3_bucket_policy.destination'
    ]
  },

  aws_glue_crawler: {
    provider: 'aws',
    name: '${var.crawler_name}',
    role: '${aws_iam_role.glue_crawler.arn}',
    database_name: '${aws_glue_catalog_database.data.name}',
    schedule: 'cron(0 1 * * ? *)',
    s3_target: [{
      path: 's3://${aws_s3_bucket.data_lake.id}/processed/',
      exclusions: ['**.tmp']
    }],
    configuration: JSON.stringify({
      Version: 1.0,
      CrawlerOutput: {
        Partitions: { AddOrUpdateBehavior: 'InheritFromTable' },
        Tables: { AddOrUpdateBehavior: 'MergeNewColumns' }
      }
    }),
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_iam_role.glue_crawler',
      'aws_glue_catalog_database.data',
      'aws_s3_bucket.data_lake'
    ]
  },

  aws_athena_database: {
    provider: 'aws',
    name: 'example_database',
    bucket: 'example-bucket',
    force_destroy: true,
  },

  // Integration Resources
  aws_sqs_queue: {
    provider: 'aws',
    name: '${var.queue_name}',
    policy: '${data.aws_iam_policy_document.sqs_policy.json}',
    redrive_policy: JSON.stringify({
      deadLetterTargetArn: '${aws_sqs_queue.deadletter.arn}',
      maxReceiveCount: 4
    }),
    depends_on: [
      'aws_sqs_queue.deadletter',
      'aws_kms_key.sqs'
    ]
  },

  aws_sns_topic: {
    provider: 'aws',
    name: '${var.topic_name}',
    policy: '${data.aws_iam_policy_document.sns_policy.json}',
    kms_master_key_id: '${aws_kms_key.sns.id}',
    depends_on: [
      'aws_kms_key.sns'
    ]
  },

  aws_eventbridge_rule: {
    provider: 'aws',
    name: 'example-rule',
    description: 'Example EventBridge rule',
    schedule_expression: 'rate(5 minutes)',
    is_enabled: true,
    tags: {
      Environment: 'production',
    },
  },

  aws_mq_broker: {
    provider: 'aws',
    broker_name: 'example-broker',
    engine_type: 'ActiveMQ',
    engine_version: '5.16.3',
    host_instance_type: 'mq.t3.micro',
    security_groups: ['sg-12345678'],
    subnet_ids: ['subnet-12345678'],
    user: [
      {
        username: 'admin',
        password: 'password123',
      },
    ],
    tags: {
      Environment: 'production',
    },
  },

  aws_api_gateway_rest_api: {
    provider: 'aws',
    name: '${var.api_name}',
    description: '${var.api_description}',
    endpoint_configuration: {
      types: ['REGIONAL'],
      vpc_endpoint_ids: ['${aws_vpc_endpoint.execute_api.id}']
    },
    policy: '${data.aws_iam_policy_document.api_policy.json}',
    minimum_compression_size: 1024,
    binary_media_types: ['application/octet-stream', 'image/*'],
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_vpc_endpoint.execute_api',
      'aws_api_gateway_vpc_link.main'
    ]
  },

  // Monitoring Resources
  aws_cloudwatch_log_group: {
    provider: 'aws',
    name: '/aws/example/log-group',
    retention_in_days: 14,
    tags: {
      Environment: 'production',
    },
  },

  aws_cloudwatch_metric_alarm: {
    provider: 'aws',
    alarm_name: '${var.alarm_name}',
    comparison_operator: 'GreaterThanOrEqualToThreshold',
    evaluation_periods: 2,
    metric_name: 'CPUUtilization',
    namespace: 'AWS/EC2',
    period: 120,
    statistic: 'Average',
    threshold: 80,
    alarm_description: 'Example alarm for CPU utilization',
    alarm_actions: ['${aws_sns_topic.alerts.arn}'],
    dimensions: {
      AutoScalingGroupName: '${aws_autoscaling_group.app.name}'
    },
    tags: {
      Environment: 'production',
    },
    depends_on: [
      'aws_sns_topic.alerts',
      'aws_autoscaling_group.app'
    ]
  },

  aws_cloudwatch_dashboard: {
    provider: 'aws',
    dashboard_name: 'example-dashboard',
    dashboard_body: JSON.stringify({
      widgets: [
        {
          type: 'metric',
          properties: {
            metrics: [['AWS/EC2', 'CPUUtilization']],
            period: 300,
            stat: 'Average',
            region: 'us-east-1',
            title: 'EC2 CPU Utilization',
          },
        },
      ],
    }),
  },

  aws_xray_sampling_rule: {
    provider: 'aws',
    rule_name: 'example-rule',
    priority: 1000,
    reservoir_size: 1,
    fixed_rate: 0.05,
    host: '*',
    http_method: '*',
    service_name: '*',
    service_type: '*',
    url_path: '*',
    version: 1,
    tags: {
      Environment: 'production',
    },
  },

  // Machine Learning Resources
  aws_sagemaker_notebook_instance: {
    provider: 'aws',
    name: 'example-notebook',
    instance_type: 'ml.t2.medium',
    role_arn: 'arn:aws:iam::123456789012:role/sagemaker-role',
    tags: {
      Environment: 'production',
    },
  },

  aws_sagemaker_endpoint: {
    provider: 'aws',
    name: 'example-endpoint',
    endpoint_config_name: 'example-endpoint-config',
    tags: {
      Environment: 'production',
    },
  },

  aws_sagemaker_model: {
    provider: 'aws',
    name: 'example-model',
    execution_role_arn: 'arn:aws:iam::123456789012:role/sagemaker-role',
    primary_container: {
      image: '123456789012.dkr.ecr.us-east-1.amazonaws.com/example-model:latest',
    },
    tags: {
      Environment: 'production',
    },
  },

  aws_comprehend_entity_recognizer: {
    provider: 'aws',
    name: '${var.comprehend_recognizer_name}',
    data_access_role_arn: '${aws_iam_role.comprehend.arn}',
    input_data_config: {
      entity_types: [
        {
          type: 'PERSON',
        },
      ],
      documents: {
        s3_uri: '${aws_s3_bucket.comprehend_data.arn}/documents',
        input_format: 'ONE_DOC_PER_LINE',
      },
      annotations: {
        s3_uri: '${aws_s3_bucket.comprehend_data.arn}/annotations',
      },
    },
    language_code: 'en',
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_iam_role.comprehend',
      'aws_s3_bucket.comprehend_data'
    ],
  },

  // Content Delivery Resources
  aws_cloudfront_distribution: {
    enabled: true,
    is_ipv6_enabled: true,
    comment: '${var.cloudfront_comment}',
    default_root_object: 'index.html',
    price_class: 'PriceClass_100',
    origin: [
      {
        domain_name: '${aws_s3_bucket.website.bucket_regional_domain_name}',
        origin_id: 'S3-${aws_s3_bucket.website.id}',
        s3_origin_config: {
          origin_access_identity: '${aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path}',
        },
      },
    ],
    default_cache_behavior: {
      allowed_methods: ['GET', 'HEAD'],
      cached_methods: ['GET', 'HEAD'],
      target_origin_id: 'S3-${aws_s3_bucket.website.id}',
      forwarded_values: {
        query_string: false,
        cookies: {
          forward: 'none',
        },
      },
      viewer_protocol_policy: 'redirect-to-https',
      min_ttl: 0,
      default_ttl: 3600,
      max_ttl: 86400,
    },
    restrictions: {
      geo_restriction: {
        restriction_type: 'none',
      },
    },
    viewer_certificate: {
      cloudfront_default_certificate: true,
    },
    tags: {
      Environment: '${var.environment}',
    },
    depends_on: [
      'aws_s3_bucket.website',
      'aws_cloudfront_origin_access_identity.default'
    ],
  },

  aws_cloudfront_origin_access_identity: {
    comment: 'Example OAI',
  },

  aws_cloudfront_function: {
    name: 'example-function',
    runtime: 'cloudfront-js-1.0',
    comment: 'Example CloudFront function',
    publish: true,
    code: `
function handler(event) {
    return {
        statusCode: 200,
        statusDescription: 'OK',
        headers: {
            'cache-control': { value: 'max-age=3600' }
        }
    }
}`,
  },

  aws_shield_protection: {
    name: 'example-protection',
    resource_arn: 'arn:aws:cloudfront::123456789012:distribution/ABCDEF123456',
    tags: {
      Environment: 'production',
    },
  },

  // Developer Tools Resources
  aws_codebuild_project: {
    name: '${var.project_name}',
    description: 'Example CodeBuild project',
    service_role: '${aws_iam_role.codebuild_service.arn}',
    artifacts: {
      type: 'S3',
      location: '${aws_s3_bucket.artifacts.bucket}'
    },
    environment: {
      compute_type: 'BUILD_GENERAL1_SMALL',
      image: 'aws/codebuild/standard:5.0',
      type: 'LINUX_CONTAINER',
    },
    source: {
      type: 'CODECOMMIT',
      location: '${aws_codecommit_repository.app.clone_url_http}'
    },
    tags: {
      Environment: 'production',
    },
    depends_on: [
      'aws_iam_role_policy_attachment.codebuild_policy',
      'aws_s3_bucket.artifacts'
    ]
  },

  aws_codepipeline: {
    name: 'example-pipeline',
    role_arn: 'arn:aws:iam::123456789012:role/codepipeline-role',
    artifact_store: [
      {
        location: 'example-bucket',
        type: 'S3',
      },
    ],
    stage: [
      {
        name: 'Source',
        action: [
          {
            name: 'Source',
            category: 'Source',
            owner: 'AWS',
            provider: 'CodeCommit',
            version: '1',
            configuration: {
              RepositoryName: 'example-repo',
              BranchName: 'main',
            },
            output_artifacts: ['source_output'],
          },
        ],
      },
    ],
    tags: {
      Environment: 'production',
    },
  },

  aws_codecommit_repository: {
    repository_name: 'example-repo',
    description: 'Example CodeCommit repository',
    default_branch: 'main',
    tags: {
      Environment: 'production',
    },
  },

  aws_codeartifact_domain: {
    domain: 'example-domain',
    encryption_key: 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
    tags: {
      Environment: 'production',
    },
  },

  aws_codestarconnections_connection: {
    name: 'example-connection',
    provider_type: 'GitHub',
    tags: {
      Environment: 'production',
    },
  },

  // Route53 and Certificate Resources
  aws_route53_record: {
    zone_id: '${data.aws_route53_zone.selected.zone_id}',
    name: '${var.domain_name}',
    type: 'A',
    alias: {
      name: '${aws_cloudfront_distribution.main.domain_name}',
      zone_id: '${aws_cloudfront_distribution.main.hosted_zone_id}',
      evaluate_target_health: false
    },
    depends_on: [
      'aws_cloudfront_distribution.main'
    ]
  },

  aws_acm_certificate: {
    domain_name: '${var.domain_name}',
    validation_method: 'DNS',
    subject_alternative_names: ['*.${var.domain_name}'],
    tags: {
      Environment: '${var.environment}'
    },
    lifecycle: {
      create_before_destroy: true
    }
  },

  // WAF Resources
  aws_wafv2_web_acl: {
    name: '${var.waf_name}',
    description: 'WAF ACL for ${var.environment}',
    scope: 'REGIONAL',
    default_action: {
      allow: {}
    },
    rule: [
      {
        name: 'AWSManagedRulesCommonRuleSet',
        priority: 1,
        override_action: {
          none: {}
        },
        statement: {
          managed_rule_group_statement: {
            name: 'AWSManagedRulesCommonRuleSet',
            vendor_name: 'AWS'
          }
        },
        visibility_config: {
          cloudwatch_metrics_enabled: true,
          metric_name: 'AWSManagedRulesCommonRuleSetMetric',
          sampled_requests_enabled: true
        }
      }
    ],
    visibility_config: {
      cloudwatch_metrics_enabled: true,
      metric_name: '${var.waf_name}Metric',
      sampled_requests_enabled: true
    },
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_wafv2_ip_set.blacklist',
      'aws_wafv2_regex_pattern_set.bad_bots'
    ]
  },

  // EventBridge Resources
  aws_cloudwatch_event_rule: {
    name: '${var.event_rule_name}',
    description: '${var.event_rule_description}',
    schedule_expression: 'rate(5 minutes)',
    event_pattern: JSON.stringify({
      source: ['aws.ec2'],
      'detail-type': ['EC2 Instance State-change Notification']
    }),
    is_enabled: true,
    tags: {
      Environment: '${var.environment}'
    }
  },

  // Backup Resources
  aws_backup_vault: {
    name: '${var.backup_vault_name}',
    kms_key_arn: '${aws_kms_key.backup.arn}',
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_kms_key.backup'
    ]
  },

  aws_backup_plan: {
    name: '${var.backup_plan_name}',
    rule: [{
      rule_name: 'daily_backup',
      target_vault_name: '${aws_backup_vault.main.name}',
      schedule: 'cron(0 5 ? * * *)',
      start_window: 480,
      completion_window: 720,
      lifecycle: {
        cold_storage_after: 30,
        delete_after: 90
      },
      copy_action: {
        destination_vault_arn: '${aws_backup_vault.replica.arn}',
        lifecycle: {
          cold_storage_after: 30,
          delete_after: 90
        }
      }
    }],
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_backup_vault.main',
      'aws_backup_vault.replica'
    ]
  },

  // Systems Manager Resources
  aws_ssm_parameter: {
    name: '/${var.environment}/${var.application}/${var.parameter_name}',
    description: '${var.parameter_description}',
    type: 'SecureString',
    value: '${var.parameter_value}',
    key_id: '${aws_kms_key.ssm.key_id}',
    tier: 'Standard',
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_kms_key.ssm'
    ]
  },

  // Service Discovery Resources
  aws_service_discovery_private_dns_namespace: {
    name: '${var.namespace_name}',
    vpc: '${aws_vpc.main.id}',
    description: 'Private DNS namespace for ${var.environment}',
    tags: {
      Environment: '${var.environment}'
    },
    depends_on: [
      'aws_vpc.main'
    ]
  },

  aws_service_discovery_service: {
    name: '${var.service_name}',
    dns_config: {
      namespace_id: '${aws_service_discovery_private_dns_namespace.namespace.id}',
      dns_records: [{
        ttl: 10,
        type: 'A'
      }]
    },
    depends_on: [
      'aws_service_discovery_private_dns_namespace.namespace'
    ]
  },

  // Transit Gateway Resources
  aws_ec2_transit_gateway: {
    description: 'Transit Gateway for ${var.environment}',
    auto_accept_shared_attachments: 'enable',
    default_route_table_association: 'enable',
    default_route_table_propagation: 'enable',
    dns_support: 'enable',
    vpn_ecmp_support: 'enable',
    tags: {
      Environment: '${var.environment}'
    }
  },

  // Direct Connect Resources
  aws_dx_connection: {
    name: '${var.dx_connection_name}',
    bandwidth: '1Gbps',
    location: '${var.dx_location}',
    tags: {
      Environment: '${var.environment}'
    }
  }
} 