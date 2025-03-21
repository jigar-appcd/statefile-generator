import { ResourceCategory } from '@/types/cloud'

export const awsCategories: ResourceCategory[] = [
  {
    id: 'compute',
    name: 'Compute',
    description: 'EC2, Lambda, and other compute services',
    resources: [
      {
        id: 'aws_instance',
        name: 'EC2 Instance',
        type: 'aws_instance',
        category: 'compute',
        description: 'Virtual server in the cloud',
        attributes: {},
      },
      {
        id: 'aws_lambda_function',
        name: 'Lambda Function',
        type: 'aws_lambda_function',
        category: 'compute',
        description: 'Serverless compute service',
        attributes: {},
      },
      {
        id: 'aws_ebs_volume',
        name: 'EBS Volume',
        type: 'aws_ebs_volume',
        category: 'compute',
        description: 'Elastic Block Store volume',
        attributes: {},
      },
      {
        id: 'aws_autoscaling_group',
        name: 'Auto Scaling Group',
        type: 'aws_autoscaling_group',
        category: 'compute',
        description: 'Auto Scaling Group for EC2 instances',
        attributes: {},
      },
    ],
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'VPC, Subnets, Load Balancers, and other networking services',
    resources: [
      {
        id: 'aws_vpc',
        name: 'VPC',
        type: 'aws_vpc',
        category: 'networking',
        description: 'Virtual Private Cloud',
        attributes: {},
      },
      {
        id: 'aws_subnet',
        name: 'Subnet',
        type: 'aws_subnet',
        category: 'networking',
        description: 'VPC Subnet',
        attributes: {},
      },
      {
        id: 'aws_internet_gateway',
        name: 'Internet Gateway',
        type: 'aws_internet_gateway',
        category: 'networking',
        description: 'VPC Internet Gateway',
        attributes: {},
      },
      {
        id: 'aws_route_table',
        name: 'Route Table',
        type: 'aws_route_table',
        category: 'networking',
        description: 'VPC Route Table',
        attributes: {},
      },
      {
        id: 'aws_security_group',
        name: 'Security Group',
        type: 'aws_security_group',
        category: 'networking',
        description: 'Security Group for resources',
        attributes: {},
      },
      {
        id: 'aws_lb',
        name: 'Load Balancer',
        type: 'aws_lb',
        category: 'networking',
        description: 'Application or Network Load Balancer',
        attributes: {},
      },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    description: 'RDS, DynamoDB, ElastiCache, and other database services',
    resources: [
      {
        id: 'aws_db_instance',
        name: 'RDS Instance',
        type: 'aws_db_instance',
        category: 'database',
        description: 'Relational Database Service instance',
        attributes: {},
      },
      {
        id: 'aws_dynamodb_table',
        name: 'DynamoDB Table',
        type: 'aws_dynamodb_table',
        category: 'database',
        description: 'DynamoDB NoSQL table',
        attributes: {},
      },
      {
        id: 'aws_elasticache_cluster',
        name: 'ElastiCache Cluster',
        type: 'aws_elasticache_cluster',
        category: 'database',
        description: 'Managed Redis or Memcached cluster',
        attributes: {},
      },
      {
        id: 'aws_redshift_cluster',
        name: 'Redshift Cluster',
        type: 'aws_redshift_cluster',
        category: 'database',
        description: 'Managed data warehouse service',
        attributes: {},
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'S3, EFS, and other storage services',
    resources: [
      {
        id: 'aws_s3_bucket',
        name: 'S3 Bucket',
        type: 'aws_s3_bucket',
        category: 'storage',
        description: 'Simple Storage Service bucket',
        attributes: {},
      },
      {
        id: 'aws_efs_file_system',
        name: 'EFS File System',
        type: 'aws_efs_file_system',
        category: 'storage',
        description: 'Elastic File System',
        attributes: {},
      },
    ],
  },
  {
    id: 'containers',
    name: 'Containers',
    description: 'ECS, EKS, and other container services',
    resources: [
      {
        id: 'aws_ecs_cluster',
        name: 'ECS Cluster',
        type: 'aws_ecs_cluster',
        category: 'containers',
        description: 'Elastic Container Service cluster',
        attributes: {},
      },
      {
        id: 'aws_eks_cluster',
        name: 'EKS Cluster',
        type: 'aws_eks_cluster',
        category: 'containers',
        description: 'Elastic Kubernetes Service cluster',
        attributes: {},
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'IAM, KMS, and other security services',
    resources: [
      {
        id: 'aws_iam_role',
        name: 'IAM Role',
        type: 'aws_iam_role',
        category: 'security',
        description: 'IAM Role for services',
        attributes: {},
      },
      {
        id: 'aws_kms_key',
        name: 'KMS Key',
        type: 'aws_kms_key',
        category: 'security',
        description: 'KMS encryption key',
        attributes: {},
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'EMR, Kinesis, and other analytics services',
    resources: [
      {
        id: 'aws_emr_cluster',
        name: 'EMR Cluster',
        type: 'aws_emr_cluster',
        category: 'analytics',
        description: 'Elastic MapReduce cluster for big data processing',
        attributes: {},
      },
      {
        id: 'aws_kinesis_stream',
        name: 'Kinesis Stream',
        type: 'aws_kinesis_stream',
        category: 'analytics',
        description: 'Real-time data streaming service',
        attributes: {},
      },
      {
        id: 'aws_kinesis_firehose_delivery_stream',
        name: 'Kinesis Firehose',
        type: 'aws_kinesis_firehose_delivery_stream',
        category: 'analytics',
        description: 'Managed data delivery service',
        attributes: {},
      },
      {
        id: 'aws_glue_crawler',
        name: 'Glue Crawler',
        type: 'aws_glue_crawler',
        category: 'analytics',
        description: 'Metadata crawler for AWS Glue',
        attributes: {},
      },
      {
        id: 'aws_athena_database',
        name: 'Athena Database',
        type: 'aws_athena_database',
        category: 'analytics',
        description: 'Interactive query service database',
        attributes: {},
      },
    ],
  },
  {
    id: 'integration',
    name: 'Application Integration',
    description: 'SQS, SNS, EventBridge, and other integration services',
    resources: [
      {
        id: 'aws_sqs_queue',
        name: 'SQS Queue',
        type: 'aws_sqs_queue',
        category: 'integration',
        description: 'Simple Queue Service queue',
        attributes: {},
      },
      {
        id: 'aws_sns_topic',
        name: 'SNS Topic',
        type: 'aws_sns_topic',
        category: 'integration',
        description: 'Simple Notification Service topic',
        attributes: {},
      },
      {
        id: 'aws_eventbridge_rule',
        name: 'EventBridge Rule',
        type: 'aws_eventbridge_rule',
        category: 'integration',
        description: 'EventBridge rule for event routing',
        attributes: {},
      },
      {
        id: 'aws_mq_broker',
        name: 'MQ Broker',
        type: 'aws_mq_broker',
        category: 'integration',
        description: 'Managed message broker service',
        attributes: {},
      },
      {
        id: 'aws_api_gateway_rest_api',
        name: 'API Gateway',
        type: 'aws_api_gateway_rest_api',
        category: 'integration',
        description: 'REST API Gateway',
        attributes: {},
      },
    ],
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Logging',
    description: 'CloudWatch, X-Ray, and other monitoring services',
    resources: [
      {
        id: 'aws_cloudwatch_log_group',
        name: 'CloudWatch Log Group',
        type: 'aws_cloudwatch_log_group',
        category: 'monitoring',
        description: 'Log group for CloudWatch Logs',
        attributes: {},
      },
      {
        id: 'aws_cloudwatch_metric_alarm',
        name: 'CloudWatch Alarm',
        type: 'aws_cloudwatch_metric_alarm',
        category: 'monitoring',
        description: 'Metric alarm for CloudWatch',
        attributes: {},
      },
      {
        id: 'aws_cloudwatch_dashboard',
        name: 'CloudWatch Dashboard',
        type: 'aws_cloudwatch_dashboard',
        category: 'monitoring',
        description: 'Custom dashboard for metrics and logs',
        attributes: {},
      },
      {
        id: 'aws_xray_sampling_rule',
        name: 'X-Ray Sampling Rule',
        type: 'aws_xray_sampling_rule',
        category: 'monitoring',
        description: 'Sampling rule for X-Ray tracing',
        attributes: {},
      },
    ],
  },
  {
    id: 'machine_learning',
    name: 'Machine Learning',
    description: 'SageMaker and other ML services',
    resources: [
      {
        id: 'aws_sagemaker_notebook_instance',
        name: 'SageMaker Notebook',
        type: 'aws_sagemaker_notebook_instance',
        category: 'machine_learning',
        description: 'Jupyter notebook instance for ML development',
        attributes: {},
      },
      {
        id: 'aws_sagemaker_endpoint',
        name: 'SageMaker Endpoint',
        type: 'aws_sagemaker_endpoint',
        category: 'machine_learning',
        description: 'Endpoint for model deployment',
        attributes: {},
      },
      {
        id: 'aws_sagemaker_model',
        name: 'SageMaker Model',
        type: 'aws_sagemaker_model',
        category: 'machine_learning',
        description: 'Machine learning model',
        attributes: {},
      },
      {
        id: 'aws_comprehend_entity_recognizer',
        name: 'Comprehend Entity Recognizer',
        type: 'aws_comprehend_entity_recognizer',
        category: 'machine_learning',
        description: 'Custom entity recognition model',
        attributes: {},
      },
    ],
  },
  {
    id: 'content_delivery',
    name: 'Content Delivery',
    description: 'CloudFront and other CDN services',
    resources: [
      {
        id: 'aws_cloudfront_distribution',
        name: 'CloudFront Distribution',
        type: 'aws_cloudfront_distribution',
        category: 'content_delivery',
        description: 'Content delivery network distribution',
        attributes: {},
      },
      {
        id: 'aws_cloudfront_origin_access_identity',
        name: 'CloudFront OAI',
        type: 'aws_cloudfront_origin_access_identity',
        category: 'content_delivery',
        description: 'Origin access identity for CloudFront',
        attributes: {},
      },
      {
        id: 'aws_cloudfront_function',
        name: 'CloudFront Function',
        type: 'aws_cloudfront_function',
        category: 'content_delivery',
        description: 'Lightweight edge function',
        attributes: {},
      },
      {
        id: 'aws_shield_protection',
        name: 'Shield Protection',
        type: 'aws_shield_protection',
        category: 'content_delivery',
        description: 'DDoS protection for resources',
        attributes: {},
      },
    ],
  },
  {
    id: 'developer_tools',
    name: 'Developer Tools',
    description: 'CodeBuild, CodePipeline, and other development services',
    resources: [
      {
        id: 'aws_codebuild_project',
        name: 'CodeBuild Project',
        type: 'aws_codebuild_project',
        category: 'developer_tools',
        description: 'Build automation project',
        attributes: {},
      },
      {
        id: 'aws_codepipeline',
        name: 'CodePipeline',
        type: 'aws_codepipeline',
        category: 'developer_tools',
        description: 'Continuous delivery pipeline',
        attributes: {},
      },
      {
        id: 'aws_codecommit_repository',
        name: 'CodeCommit Repository',
        type: 'aws_codecommit_repository',
        category: 'developer_tools',
        description: 'Git repository',
        attributes: {},
      },
      {
        id: 'aws_codeartifact_domain',
        name: 'CodeArtifact Domain',
        type: 'aws_codeartifact_domain',
        category: 'developer_tools',
        description: 'Artifact repository domain',
        attributes: {},
      },
      {
        id: 'aws_codestarconnections_connection',
        name: 'CodeStar Connection',
        type: 'aws_codestarconnections_connection',
        category: 'developer_tools',
        description: 'Connection to external code repository',
        attributes: {},
      },
    ],
  },
] 