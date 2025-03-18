import { ResourceCategory } from '@/types/cloud'

export const gcpCategories: ResourceCategory[] = [
  {
    id: 'compute',
    name: 'Compute',
    description: 'Compute Engine, Cloud Functions, and other compute services',
    resources: [
      {
        id: 'google_compute_instance',
        name: 'Compute Instance',
        type: 'google_compute_instance',
        category: 'compute',
        description: 'Virtual machine instance',
        attributes: {},
      },
      {
        id: 'google_cloudfunctions_function',
        name: 'Cloud Function',
        type: 'google_cloudfunctions_function',
        category: 'compute',
        description: 'Serverless function',
        attributes: {},
      },
      {
        id: 'google_compute_disk',
        name: 'Compute Disk',
        type: 'google_compute_disk',
        category: 'compute',
        description: 'Persistent disk',
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
        id: 'google_compute_network',
        name: 'VPC Network',
        type: 'google_compute_network',
        category: 'networking',
        description: 'Virtual Private Cloud network',
        attributes: {},
      },
      {
        id: 'google_compute_subnetwork',
        name: 'Subnetwork',
        type: 'google_compute_subnetwork',
        category: 'networking',
        description: 'VPC subnetwork',
        attributes: {},
      },
      {
        id: 'google_compute_firewall',
        name: 'Firewall Rule',
        type: 'google_compute_firewall',
        category: 'networking',
        description: 'Network firewall rule',
        attributes: {},
      },
      {
        id: 'google_compute_router',
        name: 'Cloud Router',
        type: 'google_compute_router',
        category: 'networking',
        description: 'Cloud Router for dynamic routing',
        attributes: {},
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Cloud Storage, Filestore, and other storage services',
    resources: [
      {
        id: 'google_storage_bucket',
        name: 'Storage Bucket',
        type: 'google_storage_bucket',
        category: 'storage',
        description: 'Cloud Storage bucket',
        attributes: {},
      },
      {
        id: 'google_filestore_instance',
        name: 'Filestore Instance',
        type: 'google_filestore_instance',
        category: 'storage',
        description: 'Managed file storage service',
        attributes: {},
      },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Cloud SQL, Cloud Spanner, and other database services',
    resources: [
      {
        id: 'google_sql_database_instance',
        name: 'Cloud SQL Instance',
        type: 'google_sql_database_instance',
        category: 'database',
        description: 'Managed database instance',
        attributes: {},
      },
      {
        id: 'google_spanner_instance',
        name: 'Cloud Spanner Instance',
        type: 'google_spanner_instance',
        category: 'database',
        description: 'Globally distributed database instance',
        attributes: {},
      },
    ],
  },
  {
    id: 'containers',
    name: 'Containers',
    description: 'GKE and other container services',
    resources: [
      {
        id: 'google_container_cluster',
        name: 'GKE Cluster',
        type: 'google_container_cluster',
        category: 'containers',
        description: 'Google Kubernetes Engine cluster',
        attributes: {},
      },
      {
        id: 'google_container_node_pool',
        name: 'GKE Node Pool',
        type: 'google_container_node_pool',
        category: 'containers',
        description: 'Node pool for GKE cluster',
        attributes: {},
      },
    ],
  },
  {
    id: 'machine_learning',
    name: 'Machine Learning',
    description: 'AI Platform and other ML services',
    resources: [
      {
        id: 'google_ai_platform_model',
        name: 'AI Platform Model',
        type: 'google_ai_platform_model',
        category: 'machine_learning',
        description: 'Machine learning model',
        attributes: {},
      },
      {
        id: 'google_notebooks_instance',
        name: 'Notebooks Instance',
        type: 'google_notebooks_instance',
        category: 'machine_learning',
        description: 'Managed Jupyter notebook instance',
        attributes: {},
      },
      {
        id: 'google_notebooks_runtime',
        name: 'Notebooks Runtime',
        type: 'google_notebooks_runtime',
        category: 'machine_learning',
        description: 'Managed runtime for notebooks',
        attributes: {},
      },
    ],
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'Cloud Run, Cloud Functions, and other serverless services',
    resources: [
      {
        id: 'google_cloud_run_service',
        name: 'Cloud Run Service',
        type: 'google_cloud_run_service',
        category: 'serverless',
        description: 'Managed serverless platform',
        attributes: {},
      },
      {
        id: 'google_cloud_run_domain_mapping',
        name: 'Cloud Run Domain Mapping',
        type: 'google_cloud_run_domain_mapping',
        category: 'serverless',
        description: 'Custom domain for Cloud Run service',
        attributes: {},
      },
      {
        id: 'google_app_engine_application',
        name: 'App Engine Application',
        type: 'google_app_engine_application',
        category: 'serverless',
        description: 'App Engine application',
        attributes: {},
      },
      {
        id: 'google_app_engine_service',
        name: 'App Engine Service',
        type: 'google_app_engine_service',
        category: 'serverless',
        description: 'App Engine service version',
        attributes: {},
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'KMS, Secret Manager, and other security services',
    resources: [
      {
        id: 'google_kms_key_ring',
        name: 'KMS Key Ring',
        type: 'google_kms_key_ring',
        category: 'security',
        description: 'Key management key ring',
        attributes: {},
      },
      {
        id: 'google_kms_crypto_key',
        name: 'KMS Crypto Key',
        type: 'google_kms_crypto_key',
        category: 'security',
        description: 'Encryption key',
        attributes: {},
      },
      {
        id: 'google_secret_manager_secret',
        name: 'Secret Manager Secret',
        type: 'google_secret_manager_secret',
        category: 'security',
        description: 'Managed secret',
        attributes: {},
      },
      {
        id: 'google_security_center_source',
        name: 'Security Center Source',
        type: 'google_security_center_source',
        category: 'security',
        description: 'Security findings source',
        attributes: {},
      },
    ],
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Cloud Monitoring and logging services',
    resources: [
      {
        id: 'google_monitoring_alert_policy',
        name: 'Alert Policy',
        type: 'google_monitoring_alert_policy',
        category: 'monitoring',
        description: 'Monitoring alert policy',
        attributes: {},
      },
      {
        id: 'google_monitoring_dashboard',
        name: 'Dashboard',
        type: 'google_monitoring_dashboard',
        category: 'monitoring',
        description: 'Custom monitoring dashboard',
        attributes: {},
      },
      {
        id: 'google_logging_metric',
        name: 'Logging Metric',
        type: 'google_logging_metric',
        category: 'monitoring',
        description: 'Custom logging metric',
        attributes: {},
      },
      {
        id: 'google_logging_project_sink',
        name: 'Logging Sink',
        type: 'google_logging_project_sink',
        category: 'monitoring',
        description: 'Log export sink',
        attributes: {},
      },
    ],
  },
] 