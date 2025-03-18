import { CloudResource } from '@/types/cloud'
import { ACMCertificateHandler } from './aws/acm-certificate-handler'
import { APIGatewayHandler } from './aws/api-gateway-handler'
import { AthenaDatabaseHandler } from './aws/athena-database-handler'
import { AutoScalingGroupHandler } from './aws/autoscaling-group-handler'
import { BackupPlanHandler } from './aws/backup-plan-handler'
import { AWSBatchComputeEnvironmentHandler } from './aws/batch-compute-environment-handler'
import { AWSCloudFrontDistributionHandler } from './aws/cloudfront-distribution-handler'
import { CloudFrontFunctionHandler } from './aws/cloudfront-function-handler'
import { AWSCloudFrontOriginAccessIdentityHandler } from './aws/cloudfront-origin-access-identity-handler'
import { AWSCloudWatchDashboardHandler } from './aws/cloudwatch-dashboard-handler'
import { CloudWatchLogGroupHandler } from './aws/cloudwatch-log-group-handler'
import { CloudWatchMetricAlarmHandler } from './aws/cloudwatch-metric-alarm-handler'
import { AWSCodeArtifactDomainHandler } from './aws/codeartifact-domain-handler'
import { CodeBuildProjectHandler } from './aws/codebuild-project-handler'
import { CodeCommitRepositoryHandler } from './aws/codecommit-repository-handler'
import { CodePipelineHandler } from './aws/codepipeline-handler'
import { CodeStarConnectionsHandler } from './aws/codestar-connections-handler'
import { AWSComprehendEntityRecognizerHandler } from './aws/comprehend-entity-recognizer-handler'
import { AWSConfigRuleHandler } from './aws/config-rule-handler'
import { DataSyncTaskHandler } from './aws/datasync-task-handler'
import { AWSDBSubnetGroupHandler } from './aws/db-subnet-group-handler'
import { DocDBClusterHandler } from './aws/docdb-cluster-handler'
import { AWSDynamoDBTableHandler } from './aws/dynamodb-table-handler'
import { EBSVolumeHandler } from './aws/ebs-volume-handler'
import { EC2InstanceHandler } from './aws/ec2-instance-handler'
import { ECSClusterHandler } from './aws/ecs-cluster-handler'
import { ECSTaskDefinitionHandler } from './aws/ecs-task-definition-handler'
import { AWSEFSFileSystemHandler } from './aws/efs-file-system-handler'
import { EIPHandler } from './aws/eip-handler'
import { AWSEKSClusterHandler } from './aws/eks-cluster-handler'
import { AWSEKSNodeGroupHandler } from './aws/eks-node-group-handler'
import { AWSElastiCacheClusterHandler } from './aws/elasticache-cluster-handler'
import { AWSEMRClusterHandler } from './aws/emr-cluster-handler'
import { EventBridgeRuleHandler } from './aws/eventbridge-rule-handler'
import { FSxWindowsFileSystemHandler } from './aws/fsx-windows-file-system-handler'
import { AWSGlueCrawlerHandler } from './aws/glue-crawler-handler'
import { IAMRoleHandler } from './aws/iam-role-handler'
import { AWSInternetGatewayHandler } from './aws/internet-gateway-handler'
import { IoTAnalyticsPipelineHandler } from './aws/iot-analytics-pipeline-handler'
import { IoTThingHandler } from './aws/iot-thing-handler'
import { AWSKinesisFirehoseHandler } from './aws/kinesis-firehose-handler'
import { KinesisStreamHandler } from './aws/kinesis-stream-handler'
import { KMSKeyHandler } from './aws/kms-key-handler'
import { LambdaFunctionHandler } from './aws/lambda-function-handler'
import { LaunchTemplateHandler } from './aws/launch-template-handler'
import { LBTargetGroupHandler } from './aws/lb-target-group-handler'
import { LoadBalancerHandler } from './aws/load-balancer-handler'
import { AWSMQBrokerHandler } from './aws/mq-broker-handler'
import { MSKClusterHandler } from './aws/msk-cluster-handler'
import { AWSNatGatewayHandler } from './aws/nat-gateway-handler'
import { AWSNetworkACLHandler } from './aws/network-acl-handler'
import { OpenSearchDomainHandler } from './aws/opensearch-domain-handler'
import { OrganizationsAccountHandler } from './aws/organizations-account-handler'
import { QuickSightAnalysisHandler } from './aws/quicksight-analysis-handler'
import { RDSClusterHandler } from './aws/rds-cluster-handler'
import { RDSInstanceHandler } from './aws/rds-instance-handler'
import { AWSRedshiftClusterHandler } from './aws/redshift-cluster-handler'
import { RekognitionCollectionHandler } from './aws/rekognition-collection-handler'
import { AWSRouteTableAssociationHandler } from './aws/route-table-association-handler'
import { RouteTableHandler } from './aws/route-table-handler'
import { S3BucketHandler } from './aws/s3-bucket-handler'
import { S3BucketPolicyHandler } from './aws/s3-bucket-policy-handler'
import { AWSSageMakerEndpointHandler } from './aws/sagemaker-endpoint-handler'
import { AWSSageMakerModelHandler } from './aws/sagemaker-model-handler'
import { AWSSageMakerNotebookHandler } from './aws/sagemaker-notebook-handler'
import { SecurityGroupHandler } from './aws/security-group-handler'
import { AWSShieldProtectionHandler } from './aws/shield-protection-handler'
import { SNSTopicHandler } from './aws/sns-topic-handler'
import { SQSQueueHandler } from './aws/sqs-queue-handler'
import { StepFunctionsHandler } from './aws/step-functions-handler'
import { SubnetHandler } from './aws/subnet-handler'
import { TransferServerHandler } from './aws/transfer-server-handler'
import { VPCHandler } from './aws/vpc-handler'
import { WAFWebACLHandler } from './aws/waf-web-acl-handler'
import { XRaySamplingRuleHandler } from './aws/xray-sampling-rule-handler'
import { AzureAnalysisServicesHandler } from './azure/analysis-services-handler'
import { AzureAPIManagementHandler } from './azure/api-management-handler'
import { AzureAppConfigurationHandler } from './azure/app-configuration-handler'
import { AzureAppServicePlanHandler } from './azure/app-service-plan-handler'
import { AzureApplicationGatewayHandler } from './azure/application-gateway-handler'
import { AzureApplicationInsightsHandler } from './azure/application-insights-handler'
import { AzureCDNEndpointHandler } from './azure/cdn-endpoint-handler'
import { AzureCDNProfileHandler } from './azure/cdn-profile-handler'
import { AzureCognitiveDeploymentHandler } from './azure/cognitive-deployment-handler'
import { AzureCognitiveServicesHandler } from './azure/cognitive-services-handler'
import { AzureContainerGroupHandler } from './azure/container-group-handler'
import { AzureContainerRegistryHandler } from './azure/container-registry-handler'
import { AzureCosmosDBHandler } from './azure/cosmos-db-handler'
import { AzureDataFactoryHandler } from './azure/data-factory-handler'
import { AzureDataLakeAnalyticsHandler } from './azure/data-lake-analytics-handler'
import { AzureDataLakeGen2Handler } from './azure/data-lake-gen2-handler'
import { AzureDataShareHandler } from './azure/data-share-handler'
import { AzureDatabricksWorkspaceHandler } from './azure/databricks-workspace-handler'
import { AzureEventHubHandler } from './azure/event-hub-handler'
import { AzureEventGridSubscriptionHandler } from './azure/eventgrid-subscription-handler'
import { AzureEventGridTopicHandler } from './azure/eventgrid-topic-handler'
import { AzureFrontDoorHandler } from './azure/front-door-handler'
import { AzureFunctionAppHandler } from './azure/function-app-handler'
import { AzureHDInsightClusterHandler } from './azure/hdinsight-cluster-handler'
import { AzureIoTHubHandler } from './azure/iot-hub-handler'
import { AzureKeyVaultHandler } from './azure/key-vault-handler'
import { AzureKeyVaultKeyHandler } from './azure/key-vault-key-handler'
import { AzureKeyVaultSecretHandler } from './azure/key-vault-secret-handler'
import { AzureKubernetesServiceHandler } from './azure/kubernetes-service-handler'
import { AzureLoadBalancerHandler } from './azure/load-balancer-handler'
import { AzureLogAnalyticsWorkspaceHandler } from './azure/log-analytics-workspace-handler'
import { AzureLogicAppTriggerHttpHandler } from './azure/logic-app-trigger-http-handler'
import { AzureLogicAppWorkflowHandler } from './azure/logic-app-workflow-handler'
import { AzureMachineLearningComputeClusterHandler } from './azure/machine-learning-compute-cluster-handler'
import { AzureMachineLearningWorkspaceHandler } from './azure/machine-learning-workspace-handler'
import { AzureManagedDiskHandler } from './azure/managed-disk-handler'
import { AzureMonitorHandler } from './azure/monitor-handler'
import { AzureNetworkSecurityGroupHandler } from './azure/network-security-group-handler'
import { AzureNotificationHubHandler } from './azure/notification-hub-handler'
import { AzurePrivateDNSARecordHandler } from './azure/private-dns-a-record-handler'
import { AzurePrivateDNSCNAMERecordHandler } from './azure/private-dns-cname-record-handler'
import { AzurePrivateDNSZoneHandler } from './azure/private-dns-zone-handler'
import { AzurePrivateDNSZoneLinkHandler } from './azure/private-dns-zone-link-handler'
import { AzurePrivateEndpointHandler } from './azure/private-endpoint-handler'
import { AzurePurviewAccountHandler } from './azure/purview-account-handler'
import { AzureRedisCacheHandler } from './azure/redis-cache-handler'
import { AzureSearchServiceHandler } from './azure/search-service-handler'
import { AzureServiceBusHandler } from './azure/service-bus-handler'
import { AzureServicePlanHandler } from './azure/service-plan-handler'
import { AzureServiceBusQueueHandler } from './azure/servicebus-queue-handler'
import { AzureSignalRServiceHandler } from './azure/signalr-service-handler'
import { AzureSpringCloudServiceHandler } from './azure/spring-cloud-service-handler'
import { AzureSQLDatabaseHandler } from './azure/sql-database-handler'
import { AzureSQLServerHandler } from './azure/sql-server-handler'
import { AzureStaticSiteHandler } from './azure/static-site-handler'
import { AzureStaticWebAppHandler } from './azure/static-web-app-handler'
import { AzureStorageAccountHandler } from './azure/storage-account-handler'
import { AzureStorageContainerHandler } from './azure/storage-container-handler'
import { AzureStorageQueueHandler } from './azure/storage-queue-handler'
import { AzureStorageShareHandler } from './azure/storage-share-handler'
import { AzureStorageTableHandler } from './azure/storage-table-handler'
import { AzureStreamAnalyticsJobHandler } from './azure/stream-analytics-job-handler'
import { AzureSubnetHandler } from './azure/subnet-handler'
import { AzureSynapseFirewallRuleHandler } from './azure/synapse-firewall-rule-handler'
import { AzureSynapseSparkPoolHandler } from './azure/synapse-spark-pool-handler'
import { AzureSynapseSQLPoolHandler } from './azure/synapse-sql-pool-handler'
import { AzureSynapseWorkspaceHandler } from './azure/synapse-workspace-handler'
import { AzureTrafficManagerHandler } from './azure/traffic-manager-handler'
import { AzureVirtualMachineHandler } from './azure/virtual-machine-handler'
import { AzureVirtualNetworkHandler } from './azure/virtual-network-handler'
import { AzureWebAppHandler } from './azure/web-app-handler'
import { ResourceHandler } from './base-handler'
import { GCPAIPlatformModelHandler } from './gcp/ai-platform-model-handler'
import { GCPAppEngineApplicationHandler } from './gcp/app-engine-application-handler'
import { GCPAppEngineServiceHandler } from './gcp/app-engine-service-handler'
import { GCPBigQueryHandler } from './gcp/bigquery-handler'
import { GCPCloudFunctionHandler } from './gcp/cloud-function-handler'
import { GCPCloudMonitoringHandler } from './gcp/cloud-monitoring-handler'
import { GCPCloudRunDomainMappingHandler } from './gcp/cloud-run-domain-mapping-handler'
import { GCPCloudRunHandler } from './gcp/cloud-run-handler'
import { GCPCloudSearchHandler } from './gcp/cloud-search-handler'
import { GCPCloudSQLHandler } from './gcp/cloud-sql-handler'
import { GCPCloudStorageHandler } from './gcp/cloud-storage-handler'
import { GCPComputeDiskHandler } from './gcp/compute-disk-handler'
import { GCPComputeFirewallHandler } from './gcp/compute-firewall-handler'
import { GCPComputeInstanceHandler } from './gcp/compute-instance-handler'
import { GCPComputeRouterHandler } from './gcp/compute-router-handler'
import { GCPComputeSubnetworkHandler } from './gcp/compute-subnetwork-handler'
import { GCPContainerNodePoolHandler } from './gcp/container-node-pool-handler'
import { GCPDataflowHandler } from './gcp/dataflow-handler'
import { GCPFilestoreInstanceHandler } from './gcp/filestore-instance-handler'
import { GCPIoTCoreHandler } from './gcp/iot-core-handler'
import { GCPKMSCryptoKeyHandler } from './gcp/kms-crypto-key-handler'
import { GCPKMSKeyRingHandler } from './gcp/kms-key-ring-handler'
import { GCPKubernetesEngineHandler } from './gcp/kubernetes-engine-handler'
import { GCPLoadBalancerHandler } from './gcp/load-balancer-handler'
import { GCPLoggingMetricHandler } from './gcp/logging-metric-handler'
import { GCPLoggingProjectSinkHandler } from './gcp/logging-project-sink-handler'
import { GCPLookerHandler } from './gcp/looker-handler'
import { GCPMemorystoreHandler } from './gcp/memorystore-handler'
import { GCPMonitoringDashboardHandler } from './gcp/monitoring-dashboard-handler'
import { GCPNotebooksInstanceHandler } from './gcp/notebooks-instance-handler'
import { GCPNotebooksRuntimeHandler } from './gcp/notebooks-runtime-handler'
import { GCPPubSubHandler } from './gcp/pubsub-handler'
import { GCPSecretManagerHandler } from './gcp/secret-manager-handler'
import { GCPSecurityCenterSourceHandler } from './gcp/security-center-source-handler'
import { GCPSpannerHandler } from './gcp/spanner-handler'
import { GCPVisionAPIHandler } from './gcp/vision-api-handler'
import { GCPVPCHandler } from './gcp/vpc-handler'

export class ResourceHandlerFactory {
  private static handlers: Map<string, ResourceHandler> = new Map([
    // AWS Handlers
    ['aws_instance', new EC2InstanceHandler()],
    ['aws_lambda_function', new LambdaFunctionHandler()],
    ['aws_db_instance', new RDSInstanceHandler()],
    ['aws_elasticache_cluster', new AWSElastiCacheClusterHandler()],
    ['aws_vpc', new VPCHandler()],
    ['aws_subnet', new SubnetHandler()],
    ['aws_security_group', new SecurityGroupHandler()],
    ['aws_s3_bucket', new S3BucketHandler()],
    ['aws_dynamodb_table', new AWSDynamoDBTableHandler()],
    ['aws_route_table', new RouteTableHandler()],
    ['aws_route_table_association', new AWSRouteTableAssociationHandler()],
    ['aws_nat_gateway', new AWSNatGatewayHandler()],
    ['aws_network_acl', new AWSNetworkACLHandler()],
    ['aws_rds_cluster', new RDSClusterHandler()],
    ['aws_docdb_cluster', new DocDBClusterHandler()],
    ['aws_s3_bucket_policy', new S3BucketPolicyHandler()],
    ['aws_fsx_windows_file_system', new FSxWindowsFileSystemHandler()],
    ['aws_launch_template', new LaunchTemplateHandler()],
    ['aws_batch_compute_environment', new AWSBatchComputeEnvironmentHandler()],
    ['aws_ecs_task_definition', new ECSTaskDefinitionHandler()],
    ['aws_eks_node_group', new AWSEKSNodeGroupHandler()],
    ['aws_eks_cluster', new AWSEKSClusterHandler()],
    ['aws_msk_cluster', new MSKClusterHandler()],
    ['aws_mq_broker', new AWSMQBrokerHandler()],
    ['aws_sfn_state_machine', new StepFunctionsHandler()],
    ['aws_wafv2_web_acl', new WAFWebACLHandler()],
    ['aws_acm_certificate', new ACMCertificateHandler()],
    ['aws_opensearch_domain', new OpenSearchDomainHandler()],
    ['aws_quicksight_analysis', new QuickSightAnalysisHandler()],
    ['aws_kinesis_stream', new KinesisStreamHandler()],
    ['aws_kinesis_firehose_delivery_stream', new AWSKinesisFirehoseHandler()],
    ['aws_sagemaker_notebook_instance', new AWSSageMakerNotebookHandler()],
    ['aws_sagemaker_model', new AWSSageMakerModelHandler()],
    ['aws_sagemaker_endpoint', new AWSSageMakerEndpointHandler()],
    ['aws_rekognition_collection', new RekognitionCollectionHandler()],
    ['aws_iot_thing', new IoTThingHandler()],
    ['aws_iotanalytics_pipeline', new IoTAnalyticsPipelineHandler()],
    ['aws_cloudwatch_metric_alarm', new CloudWatchMetricAlarmHandler()],
    ['aws_ebs_volume', new EBSVolumeHandler()],
    ['aws_autoscaling_group', new AutoScalingGroupHandler()],
    ['aws_cloudfront_distribution', new AWSCloudFrontDistributionHandler()],
    ['aws_athena_database', new AthenaDatabaseHandler()],
    ['aws_redshift_cluster', new AWSRedshiftClusterHandler()],
    ['aws_transfer_server', new TransferServerHandler()],
    ['aws_datasync_task', new DataSyncTaskHandler()],
    ['aws_organizations_account', new OrganizationsAccountHandler()],
    ['aws_config_rule', new AWSConfigRuleHandler()],
    ['aws_backup_plan', new BackupPlanHandler()],
    ['aws_codeartifact_domain', new AWSCodeArtifactDomainHandler()],
    ['aws_codepipeline', new CodePipelineHandler()],
    ['aws_eventbridge_rule', new EventBridgeRuleHandler()],
    ['aws_iam_role', new IAMRoleHandler()],
    ['aws_kms_key', new KMSKeyHandler()],
    ['aws_lb', new LoadBalancerHandler()],
    ['aws_lb_target_group', new LBTargetGroupHandler()],
    ['aws_cloudwatch_log_group', new CloudWatchLogGroupHandler()],
    ['aws_emr_cluster', new AWSEMRClusterHandler()],
    ['aws_api_gateway_rest_api', new APIGatewayHandler()],
    ['aws_sns_topic', new SNSTopicHandler()],
    ['aws_sqs_queue', new SQSQueueHandler()],
    ['aws_efs_file_system', new AWSEFSFileSystemHandler()],
    ['aws_eip', new EIPHandler()],
    ['aws_internet_gateway', new AWSInternetGatewayHandler()],
    ['aws_db_subnet_group', new AWSDBSubnetGroupHandler()],
    ['aws_glue_crawler', new AWSGlueCrawlerHandler()],
    ['aws_cloudwatch_dashboard', new AWSCloudWatchDashboardHandler()],
    ['aws_xray_sampling_rule', new XRaySamplingRuleHandler()],
    ['aws_comprehend_entity_recognizer', new AWSComprehendEntityRecognizerHandler()],
    ['aws_cloudfront_origin_access_identity', new AWSCloudFrontOriginAccessIdentityHandler()],
    ['aws_cloudfront_function', new CloudFrontFunctionHandler()],
    ['aws_shield_protection', new AWSShieldProtectionHandler()],
    ['aws_codebuild_project', new CodeBuildProjectHandler()],
    ['aws_codecommit_repository', new CodeCommitRepositoryHandler()],
    ['aws_codestarconnections_connection', new CodeStarConnectionsHandler()],
    ['aws_ecs_cluster', new ECSClusterHandler()],

    // Azure Handlers
    ['azurerm_virtual_machine', new AzureVirtualMachineHandler()],
    ['azurerm_function_app', new AzureFunctionAppHandler()],
    ['azurerm_kubernetes_cluster', new AzureKubernetesServiceHandler()],
    ['azurerm_storage_account', new AzureStorageAccountHandler()],
    ['azurerm_virtual_network', new AzureVirtualNetworkHandler()],
    ['azurerm_network_security_group', new AzureNetworkSecurityGroupHandler()],
    ['azurerm_mssql_database', new AzureSQLDatabaseHandler()],
    ['azurerm_servicebus_namespace', new AzureServiceBusHandler()],
    ['azurerm_redis_cache', new AzureRedisCacheHandler()],
    ['azurerm_container_registry', new AzureContainerRegistryHandler()],
    ['azurerm_cosmosdb_account', new AzureCosmosDBHandler()],
    ['azurerm_eventhub', new AzureEventHubHandler()],
    ['azurerm_machine_learning_workspace', new AzureMachineLearningWorkspaceHandler()],
    ['azurerm_cognitive_account', new AzureCognitiveServicesHandler()],
    ['azurerm_iothub', new AzureIoTHubHandler()],
    ['azurerm_data_factory', new AzureDataFactoryHandler()],
    ['azurerm_monitor_action_group', new AzureMonitorHandler()],
    ['azurerm_key_vault', new AzureKeyVaultHandler()],
    ['azurerm_key_vault_secret', new AzureKeyVaultSecretHandler()],
    ['azurerm_search_service', new AzureSearchServiceHandler()],
    ['azurerm_analysis_services_server', new AzureAnalysisServicesHandler()],
    ['azurerm_managed_disk', new AzureManagedDiskHandler()],
    ['azurerm_app_service_plan', new AzureAppServicePlanHandler()],
    ['azurerm_application_insights', new AzureApplicationInsightsHandler()],
    ['azurerm_log_analytics_workspace', new AzureLogAnalyticsWorkspaceHandler()],
    ['azurerm_api_management', new AzureAPIManagementHandler()],
    ['azurerm_cognitive_deployment', new AzureCognitiveDeploymentHandler()],
    ['azurerm_private_endpoint', new AzurePrivateEndpointHandler()],
    ['azurerm_private_dns_zone', new AzurePrivateDNSZoneHandler()],
    ['azurerm_private_dns_zone_virtual_network_link', new AzurePrivateDNSZoneLinkHandler()],
    ['azurerm_private_dns_a_record', new AzurePrivateDNSARecordHandler()],
    ['azurerm_service_plan', new AzureServicePlanHandler()],
    ['azurerm_windows_web_app', new AzureWebAppHandler()],
    ['azurerm_linux_web_app', new AzureWebAppHandler()],
    ['azurerm_static_web_app', new AzureStaticWebAppHandler()],
    ['azurerm_storage_share', new AzureStorageShareHandler()],
    ['azurerm_storage_container', new AzureStorageContainerHandler()],
    ['azurerm_storage_queue', new AzureStorageQueueHandler()],
    ['azurerm_storage_table', new AzureStorageTableHandler()],
    ['azurerm_eventgrid_topic', new AzureEventGridTopicHandler()],
    ['azurerm_eventgrid_event_subscription', new AzureEventGridSubscriptionHandler()],
    ['azurerm_signalr_service', new AzureSignalRServiceHandler()],
    ['azurerm_notification_hub', new AzureNotificationHubHandler()],
    ['azurerm_stream_analytics_job', new AzureStreamAnalyticsJobHandler()],
    ['azurerm_hdinsight_hadoop_cluster', new AzureHDInsightClusterHandler()],
    ['azurerm_databricks_workspace', new AzureDatabricksWorkspaceHandler()],
    ['azurerm_storage_data_lake_gen2_filesystem', new AzureDataLakeGen2Handler()],
    ['azurerm_data_lake_analytics_account', new AzureDataLakeAnalyticsHandler()],
    ['azurerm_data_share_account', new AzureDataShareHandler()],
    ['azurerm_spring_cloud_service', new AzureSpringCloudServiceHandler()],
    ['azurerm_app_configuration', new AzureAppConfigurationHandler()],
    ['azurerm_application_gateway', new AzureApplicationGatewayHandler()],
    ['azurerm_lb', new AzureLoadBalancerHandler()],
    ['azurerm_traffic_manager_profile', new AzureTrafficManagerHandler()],
    ['azurerm_frontdoor', new AzureFrontDoorHandler()],
    ['azurerm_cdn_profile', new AzureCDNProfileHandler()],
    ['azurerm_cdn_endpoint', new AzureCDNEndpointHandler()],
    ['azurerm_machine_learning_compute_cluster', new AzureMachineLearningComputeClusterHandler()],
    ['azurerm_logic_app_workflow', new AzureLogicAppWorkflowHandler()],
    ['azurerm_logic_app_trigger_http', new AzureLogicAppTriggerHttpHandler()],
    ['azurerm_synapse_workspace', new AzureSynapseWorkspaceHandler()],
    ['azurerm_purview_account', new AzurePurviewAccountHandler()],
    ['azurerm_container_group', new AzureContainerGroupHandler()],
    ['azurerm_static_site', new AzureStaticSiteHandler()],
    ['azurerm_synapse_sql_pool', new AzureSynapseSQLPoolHandler()],
    ['azurerm_synapse_spark_pool', new AzureSynapseSparkPoolHandler()],
    ['azurerm_synapse_firewall_rule', new AzureSynapseFirewallRuleHandler()],
    ['azurerm_key_vault_key', new AzureKeyVaultKeyHandler()],
    ['azurerm_private_dns_cname_record', new AzurePrivateDNSCNAMERecordHandler()],
    ['azurerm_sql_server', new AzureSQLServerHandler()],
    ['azurerm_subnet', new AzureSubnetHandler()],
    ['azurerm_servicebus_queue', new AzureServiceBusQueueHandler()],

    // GCP Handlers
    ['google_compute_instance', new GCPComputeInstanceHandler()],
    ['google_compute_disk', new GCPComputeDiskHandler()],
    ['google_compute_subnetwork', new GCPComputeSubnetworkHandler()],
    ['google_compute_firewall', new GCPComputeFirewallHandler()],
    ['google_compute_router', new GCPComputeRouterHandler()],
    ['google_cloudfunctions_function', new GCPCloudFunctionHandler()],
    ['google_storage_bucket', new GCPCloudStorageHandler()],
    ['google_filestore_instance', new GCPFilestoreInstanceHandler()],
    ['google_sql_database_instance', new GCPCloudSQLHandler()],
    ['google_cloud_run_service', new GCPCloudRunHandler()],
    ['google_cloud_run_domain_mapping', new GCPCloudRunDomainMappingHandler()],
    ['google_container_cluster', new GCPKubernetesEngineHandler()],
    ['google_container_node_pool', new GCPContainerNodePoolHandler()],
    ['google_app_engine_application', new GCPAppEngineApplicationHandler()],
    ['google_kms_key_ring', new GCPKMSKeyRingHandler()],
    ['google_kms_crypto_key', new GCPKMSCryptoKeyHandler()],
    ['google_monitoring_dashboard', new GCPMonitoringDashboardHandler()],
    ['google_bigquery_dataset', new GCPBigQueryHandler()],
    ['google_pubsub_topic', new GCPPubSubHandler()],
    ['google_dataflow_job', new GCPDataflowHandler()],
    ['google_spanner_instance', new GCPSpannerHandler()],
    ['google_redis_instance', new GCPMemorystoreHandler()],
    ['google_compute_network', new GCPVPCHandler()],
    ['google_compute_global_forwarding_rule', new GCPLoadBalancerHandler()],
    ['google_ai_platform_model', new GCPAIPlatformModelHandler()],
    ['google_cloud_vision_product_search', new GCPVisionAPIHandler()],
    ['google_cloudiot_registry', new GCPIoTCoreHandler()],
    ['google_monitoring_alert_policy', new GCPCloudMonitoringHandler()],
    ['google_secret_manager_secret', new GCPSecretManagerHandler()],
    ['google_cloudsearch_datasource', new GCPCloudSearchHandler()],
    ['google_looker_instance', new GCPLookerHandler()],
    ['google_logging_project_sink', new GCPLoggingProjectSinkHandler()],
    ['google_logging_metric', new GCPLoggingMetricHandler()],
    ['google_app_engine_service', new GCPAppEngineServiceHandler()],
    ['google_security_center_source', new GCPSecurityCenterSourceHandler()],
    ['google_notebooks_instance', new GCPNotebooksInstanceHandler()],
    ['google_notebooks_runtime', new GCPNotebooksRuntimeHandler()]
  ])

  static getHandler(resource: CloudResource): ResourceHandler {
    const handler = this.handlers.get(resource.type)
    if (!handler) {
      throw new Error(`No handler found for resource type: ${resource.type}`)
    }
    return handler
  }

  static hasHandler(resource: CloudResource): boolean {
    return this.handlers.has(resource.type)
  }
} 