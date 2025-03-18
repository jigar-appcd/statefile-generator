import { ResourceCategory } from '@/types/cloud'

export const azureCategories: ResourceCategory[] = [
  {
    id: 'compute',
    name: 'Compute',
    description: 'Virtual Machines, Functions, and other compute services',
    resources: [
      {
        id: 'azurerm_virtual_machine',
        name: 'Virtual Machine',
        type: 'azurerm_virtual_machine',
        category: 'compute',
        description: 'Azure Virtual Machine',
        attributes: {},
      },
      {
        id: 'azurerm_function_app',
        name: 'Function App',
        type: 'azurerm_function_app',
        category: 'compute',
        description: 'Azure Functions app',
        attributes: {},
      },
      {
        id: 'azurerm_managed_disk',
        name: 'Managed Disk',
        type: 'azurerm_managed_disk',
        category: 'compute',
        description: 'Azure Managed Disk',
        attributes: {},
      },
    ],
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Virtual Networks, Subnets, Load Balancers, and other networking services',
    resources: [
      {
        id: 'azurerm_virtual_network',
        name: 'Virtual Network',
        type: 'azurerm_virtual_network',
        category: 'networking',
        description: 'Azure Virtual Network',
        attributes: {},
      },
      {
        id: 'azurerm_subnet',
        name: 'Subnet',
        type: 'azurerm_subnet',
        category: 'networking',
        description: 'Virtual Network Subnet',
        attributes: {},
      },
      {
        id: 'azurerm_network_security_group',
        name: 'Network Security Group',
        type: 'azurerm_network_security_group',
        category: 'networking',
        description: 'Network security group',
        attributes: {},
      },
      {
        id: 'azurerm_application_gateway',
        name: 'Application Gateway',
        type: 'azurerm_application_gateway',
        category: 'networking',
        description: 'Application load balancer',
        attributes: {},
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Storage Accounts, File Shares, and other storage services',
    resources: [
      {
        id: 'azurerm_storage_account',
        name: 'Storage Account',
        type: 'azurerm_storage_account',
        category: 'storage',
        description: 'Azure Storage Account',
        attributes: {},
      },
      {
        id: 'azurerm_storage_container',
        name: 'Storage Container',
        type: 'azurerm_storage_container',
        category: 'storage',
        description: 'Blob storage container',
        attributes: {},
      },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    description: 'SQL Database, Cosmos DB, and other database services',
    resources: [
      {
        id: 'azurerm_sql_server',
        name: 'SQL Server',
        type: 'azurerm_sql_server',
        category: 'database',
        description: 'Azure SQL Server',
        attributes: {},
      },
      {
        id: 'azurerm_cosmosdb_account',
        name: 'Cosmos DB Account',
        type: 'azurerm_cosmosdb_account',
        category: 'database',
        description: 'Azure Cosmos DB account',
        attributes: {},
      },
      {
        id: 'azurerm_redis_cache',
        name: 'Redis Cache',
        type: 'azurerm_redis_cache',
        category: 'database',
        description: 'Azure Cache for Redis',
        attributes: {},
      },
    ],
  },
  {
    id: 'containers',
    name: 'Containers',
    description: 'AKS and other container services',
    resources: [
      {
        id: 'azurerm_kubernetes_cluster',
        name: 'AKS Cluster',
        type: 'azurerm_kubernetes_cluster',
        category: 'containers',
        description: 'Azure Kubernetes Service cluster',
        attributes: {},
      },
      {
        id: 'azurerm_container_registry',
        name: 'Container Registry',
        type: 'azurerm_container_registry',
        category: 'containers',
        description: 'Azure Container Registry',
        attributes: {},
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Key Vault and other security services',
    resources: [
      {
        id: 'azurerm_key_vault',
        name: 'Key Vault',
        type: 'azurerm_key_vault',
        category: 'security',
        description: 'Azure Key Vault',
        attributes: {},
      },
      {
        id: 'azurerm_key_vault_secret',
        name: 'Key Vault Secret',
        type: 'azurerm_key_vault_secret',
        category: 'security',
        description: 'Secret stored in Key Vault',
        attributes: {},
      },
    ],
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'Functions, Logic Apps, and other serverless services',
    resources: [
      {
        id: 'azurerm_logic_app_workflow',
        name: 'Logic App',
        type: 'azurerm_logic_app_workflow',
        category: 'serverless',
        description: 'Logic App workflow',
        attributes: {},
      },
      {
        id: 'azurerm_logic_app_trigger_http',
        name: 'Logic App HTTP Trigger',
        type: 'azurerm_logic_app_trigger_http',
        category: 'serverless',
        description: 'HTTP trigger for Logic App',
        attributes: {},
      },
      {
        id: 'azurerm_app_service_plan',
        name: 'App Service Plan',
        type: 'azurerm_app_service_plan',
        category: 'serverless',
        description: 'Hosting plan for serverless functions',
        attributes: {},
      },
      {
        id: 'azurerm_static_site',
        name: 'Static Web App',
        type: 'azurerm_static_site',
        category: 'serverless',
        description: 'Static web app with serverless APIs',
        attributes: {},
      },
    ],
  },
  {
    id: 'machine_learning',
    name: 'Machine Learning',
    description: 'Azure ML and cognitive services',
    resources: [
      {
        id: 'azurerm_machine_learning_workspace',
        name: 'ML Workspace',
        type: 'azurerm_machine_learning_workspace',
        category: 'machine_learning',
        description: 'Machine learning workspace',
        attributes: {},
      },
      {
        id: 'azurerm_machine_learning_compute_cluster',
        name: 'ML Compute Cluster',
        type: 'azurerm_machine_learning_compute_cluster',
        category: 'machine_learning',
        description: 'Compute cluster for ML training',
        attributes: {},
      },
      {
        id: 'azurerm_cognitive_account',
        name: 'Cognitive Services',
        type: 'azurerm_cognitive_account',
        category: 'machine_learning',
        description: 'Cognitive services account',
        attributes: {},
      },
      {
        id: 'azurerm_cognitive_deployment',
        name: 'Cognitive Deployment',
        type: 'azurerm_cognitive_deployment',
        category: 'machine_learning',
        description: 'Cognitive service deployment',
        attributes: {},
      },
    ],
  },
  {
    id: 'integration',
    name: 'Integration',
    description: 'Service Bus, Event Grid, and other integration services',
    resources: [
      {
        id: 'azurerm_servicebus_namespace',
        name: 'Service Bus Namespace',
        type: 'azurerm_servicebus_namespace',
        category: 'integration',
        description: 'Service Bus messaging namespace',
        attributes: {},
      },
      {
        id: 'azurerm_servicebus_queue',
        name: 'Service Bus Queue',
        type: 'azurerm_servicebus_queue',
        category: 'integration',
        description: 'Service Bus queue',
        attributes: {},
      },
      {
        id: 'azurerm_eventgrid_topic',
        name: 'Event Grid Topic',
        type: 'azurerm_eventgrid_topic',
        category: 'integration',
        description: 'Event Grid custom topic',
        attributes: {},
      },
      {
        id: 'azurerm_api_management',
        name: 'API Management',
        type: 'azurerm_api_management',
        category: 'integration',
        description: 'API Management service',
        attributes: {},
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Synapse, HDInsight, and other analytics services',
    resources: [
      {
        id: 'azurerm_synapse_workspace',
        name: 'Synapse Workspace',
        type: 'azurerm_synapse_workspace',
        category: 'analytics',
        description: 'Synapse Analytics workspace',
        attributes: {},
      },
      {
        id: 'azurerm_synapse_sql_pool',
        name: 'Synapse SQL Pool',
        type: 'azurerm_synapse_sql_pool',
        category: 'analytics',
        description: 'Dedicated SQL pool',
        attributes: {},
      },
      {
        id: 'azurerm_hdinsight_hadoop_cluster',
        name: 'HDInsight Hadoop',
        type: 'azurerm_hdinsight_hadoop_cluster',
        category: 'analytics',
        description: 'Hadoop cluster',
        attributes: {},
      },
      {
        id: 'azurerm_stream_analytics_job',
        name: 'Stream Analytics',
        type: 'azurerm_stream_analytics_job',
        category: 'analytics',
        description: 'Stream processing job',
        attributes: {},
      },
    ],
  },
] 