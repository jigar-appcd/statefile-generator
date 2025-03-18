import { ResourceAttributes } from '@/types/cloud'

export const azureResourceAttributes: Record<string, ResourceAttributes> = {
  // Compute Resources
  azurerm_virtual_machine: {
    provider: 'azurerm',
    name: '${var.vm_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    network_interface_ids: ['${azurerm_network_interface.main.id}'],
    vm_size: 'Standard_DS1_v2',
    delete_os_disk_on_termination: true,
    delete_data_disks_on_termination: true,

    storage_image_reference: {
      publisher: 'Canonical',
      offer: 'UbuntuServer',
      sku: '18.04-LTS',
      version: 'latest',
    },

    storage_os_disk: {
      name: '${var.vm_name}-osdisk',
      caching: 'ReadWrite',
      create_option: 'FromImage',
      managed_disk_type: 'Standard_LRS',
    },

    os_profile: {
      computer_name: '${var.vm_name}',
      admin_username: '${var.admin_username}',
      admin_password: '${var.admin_password}',
    },

    os_profile_linux_config: {
      disable_password_authentication: false,
    },

    tags: {
      environment: '${var.environment}',
    },

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_network_interface.main'
    ],
  },

  azurerm_function_app: {
    provider: 'azurerm',
    name: '${var.function_app_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    app_service_plan_id: '${azurerm_app_service_plan.main.id}',
    storage_account_name: '${azurerm_storage_account.function.name}',
    storage_account_access_key: '${azurerm_storage_account.function.primary_access_key}',
    
    site_config: {
      always_on: true,
      linux_fx_version: 'DOCKER|${var.docker_image}',
    },

    app_settings: {
      FUNCTIONS_WORKER_RUNTIME: 'node',
      WEBSITE_NODE_DEFAULT_VERSION: '~14',
      APPINSIGHTS_INSTRUMENTATIONKEY: '${azurerm_application_insights.main.instrumentation_key}',
    },

    identity: {
      type: 'SystemAssigned',
    },

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_app_service_plan.main',
      'azurerm_storage_account.function',
      'azurerm_application_insights.main'
    ],
  },

  azurerm_managed_disk: {
    provider: 'azurerm',
    name: 'example-disk',
    resource_group_name: 'example-rg',
    location: 'eastus',
    storage_account_type: 'Premium_LRS',
    create_option: 'Empty',
    disk_size_gb: 100,
    encryption_settings: {
      enabled: true,
    },
    tags: {
      environment: 'production',
    },
  },

  // Networking Resources
  azurerm_virtual_network: {
    provider: 'azurerm',
    name: '${var.vnet_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    address_space: ['10.0.0.0/16'],
    dns_servers: ['8.8.8.8', '8.8.4.4'],
    tags: {
      environment: 'production',
    },

    depends_on: ['azurerm_resource_group.main'],
  },

  azurerm_subnet: {
    provider: 'azurerm',
    name: '${var.subnet_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    virtual_network_name: '${azurerm_virtual_network.main.name}',
    address_prefixes: ['10.0.1.0/24'],
    service_endpoints: ['Microsoft.Storage', 'Microsoft.Sql'],

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_virtual_network.main'
    ],
  },

  azurerm_network_security_group: {
    provider: 'azurerm',
    name: 'example-nsg',
    resource_group_name: 'example-rg',
    location: 'eastus',
    security_rule: [
      {
        name: 'allow_http',
        priority: 100,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'Tcp',
        source_port_range: '*',
        destination_port_range: '80',
        source_address_prefix: '*',
        destination_address_prefix: '*',
      },
      {
        name: 'allow_https',
        priority: 101,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'Tcp',
        source_port_range: '*',
        destination_port_range: '443',
        source_address_prefix: '*',
        destination_address_prefix: '*',
      },
    ],
    tags: {
      environment: 'production',
    },
  },

  azurerm_application_gateway: {
    provider: 'azurerm',
    name: 'example-appgw',
    resource_group_name: 'example-rg',
    location: 'eastus',
    sku: {
      name: 'Standard_v2',
      tier: 'Standard_v2',
      capacity: 2,
    },
    gateway_ip_configuration: [
      {
        name: 'gateway-ip-config',
        subnet_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Network/virtualNetworks/example-vnet/subnets/example-subnet',
      },
    ],
    frontend_port: [
      {
        name: 'frontend-port',
        port: 80,
      },
    ],
    frontend_ip_configuration: [
      {
        name: 'frontend-ip-config',
        public_ip_address_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Network/publicIPAddresses/example-pip',
      },
    ],
    backend_address_pool: [
      {
        name: 'backend-pool',
      },
    ],
    backend_http_settings: [
      {
        name: 'backend-http-settings',
        cookie_based_affinity: 'Disabled',
        port: 80,
        protocol: 'Http',
        request_timeout: 60,
      },
    ],
    http_listener: [
      {
        name: 'http-listener',
        frontend_ip_configuration_name: 'frontend-ip-config',
        frontend_port_name: 'frontend-port',
        protocol: 'Http',
      },
    ],
    request_routing_rule: [
      {
        name: 'routing-rule',
        rule_type: 'Basic',
        http_listener_name: 'http-listener',
        backend_address_pool_name: 'backend-pool',
        backend_http_settings_name: 'backend-http-settings',
        priority: 1,
      },
    ],
    tags: {
      environment: 'production',
    },
  },

  // Storage Resources
  azurerm_storage_account: {
    provider: 'azurerm',
    name: '${var.storage_account_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    account_tier: 'Standard',
    account_replication_type: 'LRS',
    enable_https_traffic_only: true,
    min_tls_version: 'TLS1_2',

    network_rules: {
      default_action: 'Deny',
      ip_rules: ['${var.allowed_ip_ranges}'],
      virtual_network_subnet_ids: ['${azurerm_subnet.main.id}'],
    },

    blob_properties: {
      versioning_enabled: true,
      container_delete_retention_policy: {
        days: 7,
      },
    },

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_subnet.main'
    ],
  },

  azurerm_storage_container: {
    provider: 'azurerm',
    name: 'example-container',
    storage_account_name: 'examplestorageaccount',
    container_access_type: 'private',
  },

  // Database Resources
  azurerm_sql_server: {
    provider: 'azurerm',
    name: '${var.sql_server_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    version: '12.0',
    administrator_login: '${var.sql_admin_username}',
    administrator_login_password: '${var.sql_admin_password}',

    depends_on: ['azurerm_resource_group.main'],
  },

  azurerm_cosmosdb_account: {
    provider: 'azurerm',
    name: '${var.cosmos_account_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    offer_type: 'Standard',
    kind: 'GlobalDocumentDB',

    consistency_policy: {
      consistency_level: 'Session',
    },

    geo_location: {
      location: '${var.failover_location}',
      failover_priority: 1,
    },

    depends_on: ['azurerm_resource_group.main'],
  },

  azurerm_mysql_server: {
    provider: 'azurerm',
    name: '${var.mysql_server_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    sku_name: 'GP_Gen5_2',
    storage_mb: 5120,
    version: '5.7',
    administrator_login: '${var.mysql_admin_username}',
    administrator_login_password: '${var.mysql_admin_password}',
    ssl_enforcement_enabled: true,

    depends_on: ['azurerm_resource_group.main'],
  },

  azurerm_redis_cache: {
    provider: 'azurerm',
    name: 'example-redis',
    resource_group_name: 'example-rg',
    location: 'eastus',
    capacity: 1,
    family: 'C',
    sku_name: 'Basic',
    enable_non_ssl_port: false,
    minimum_tls_version: '1.2',
    tags: {
      environment: 'production',
    },
  },

  // Container Resources
  azurerm_kubernetes_cluster: {
    provider: 'azurerm',
    name: '${var.aks_cluster_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    dns_prefix: '${var.aks_cluster_name}',

    default_node_pool: {
      name: 'default',
      node_count: 1,
      vm_size: 'Standard_DS2_v2',
      vnet_subnet_id: '${azurerm_subnet.aks.id}',
    },

    identity: {
      type: 'SystemAssigned',
    },

    network_profile: {
      network_plugin: 'azure',
      network_policy: 'calico',
      dns_service_ip: '10.0.0.10',
      docker_bridge_cidr: '172.17.0.1/16',
      service_cidr: '10.0.0.0/16',
    },

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_subnet.aks'
    ],
  },

  azurerm_container_registry: {
    provider: 'azurerm',
    name: 'exampleacr',
    resource_group_name: 'example-rg',
    location: 'eastus',
    sku: 'Standard',
    admin_enabled: false,
    tags: {
      environment: 'production',
    },
  },

  // Security Resources
  azurerm_key_vault: {
    provider: 'azurerm',
    name: '${var.key_vault_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    tenant_id: '${data.azurerm_client_config.current.tenant_id}',
    sku_name: 'standard',

    network_acls: {
      default_action: 'Deny',
      bypass: 'AzureServices',
      ip_rules: ['${var.allowed_ip_ranges}'],
      virtual_network_subnet_ids: ['${azurerm_subnet.main.id}'],
    },

    enabled_for_disk_encryption: true,
    purge_protection_enabled: false,
    soft_delete_retention_days: 7,

    access_policy: [
      {
        tenant_id: '00000000-0000-0000-0000-000000000000',
        object_id: '00000000-0000-0000-0000-000000000000',
        key_permissions: ['Get', 'List', 'Create', 'Delete'],
        secret_permissions: ['Get', 'List', 'Set', 'Delete'],
      },
    ],

    tags: {
      environment: 'production',
    },

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_subnet.main'
    ],
  },

  azurerm_key_vault_secret: {
    provider: 'azurerm',
    name: 'example-secret',
    key_vault_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.KeyVault/vaults/example-keyvault',
    value: 'example-value',
    content_type: 'text/plain',
    tags: {
      environment: 'production',
    },
  },

  // Serverless Resources
  azurerm_logic_app_workflow: {
    provider: 'azurerm',
    name: 'example-logic-app',
    resource_group_name: 'example-rg',
    location: 'eastus',
    workflow_schema: 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
    workflow_version: '1.0.0.0',
    parameters: {},
    tags: {
      environment: 'production',
    },
  },

  azurerm_logic_app_trigger_http: {
    provider: 'azurerm',
    name: 'example-trigger',
    logic_app_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Logic/workflows/example-logic-app',
    schema: {},
    method: 'POST',
    relative_path: 'trigger',
  },

  azurerm_app_service_plan: {
    provider: 'azurerm',
    name: 'example-plan',
    resource_group_name: 'example-rg',
    location: 'eastus',
    kind: 'Linux',
    reserved: true,
    sku: {
      tier: 'Standard',
      size: 'S1',
    },
    tags: {
      environment: 'production',
    },
  },

  azurerm_static_site: {
    provider: 'azurerm',
    name: 'example-static-site',
    resource_group_name: 'example-rg',
    location: 'eastus',
    sku_tier: 'Free',
    sku_size: 'Free',
    tags: {
      environment: 'production',
    },
  },

  // Machine Learning Resources
  azurerm_machine_learning_workspace: {
    provider: 'azurerm',
    name: 'example-mlw',
    resource_group_name: 'example-rg',
    location: 'eastus',
    application_insights_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Insights/components/example-ai',
    key_vault_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.KeyVault/vaults/example-keyvault',
    storage_account_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Storage/storageAccounts/examplestorageaccount',
    container_registry_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.ContainerRegistry/registries/exampleacr',
    tags: {
      environment: 'production',
    },
  },

  azurerm_machine_learning_compute_cluster: {
    provider: 'azurerm',
    name: 'example-compute',
    resource_group_name: 'example-rg',
    location: 'eastus',
    machine_learning_workspace_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.MachineLearningServices/workspaces/example-mlw',
    vm_priority: 'Dedicated',
    vm_size: 'STANDARD_DS2_V2',
    scale_settings: {
      min_node_count: 0,
      max_node_count: 4,
      scale_down_nodes_after_idle_duration: 'PT30M',
    },
    tags: {
      environment: 'production',
    },
  },

  azurerm_cognitive_account: {
    provider: 'azurerm',
    name: 'example-cognitive',
    resource_group_name: 'example-rg',
    location: 'eastus',
    kind: 'TextAnalytics',
    sku_name: 'S0',
    custom_subdomain_name: 'example-cognitive',
    tags: {
      environment: 'production',
    },
  },

  azurerm_cognitive_deployment: {
    provider: 'azurerm',
    name: 'example-deployment',
    cognitive_account_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.CognitiveServices/accounts/example-cognitive',
    model: {
      format: 'OpenAI',
      name: 'text-davinci-003',
      version: '1',
    },
    scale: {
      type: 'Standard',
      tier: 'Free',
      size: 'F0',
      family: 'F',
      capacity: 1,
    },
  },

  // Integration Resources
  azurerm_servicebus_namespace: {
    provider: 'azurerm',
    name: '${var.servicebus_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    sku: 'Standard',

    depends_on: ['azurerm_resource_group.main'],
  },

  azurerm_servicebus_queue: {
    provider: 'azurerm',
    name: 'example-queue',
    resource_group_name: 'example-rg',
    namespace_name: 'example-servicebus',
    enable_partitioning: true,
    max_size_in_megabytes: 1024,
    requires_duplicate_detection: true,
    requires_session: false,
  },

  azurerm_eventgrid_topic: {
    provider: 'azurerm',
    name: 'example-eventgrid',
    resource_group_name: 'example-rg',
    location: 'eastus',
    tags: {
      environment: 'production',
    },
  },

  azurerm_api_management: {
    provider: 'azurerm',
    name: 'example-apim',
    resource_group_name: 'example-rg',
    location: 'eastus',
    publisher_name: 'Example Company',
    publisher_email: 'admin@example.com',
    sku_name: 'Developer_1',
    virtual_network_type: 'None',
    tags: {
      environment: 'production',
    },
  },

  // Analytics Resources
  azurerm_synapse_workspace: {
    provider: 'azurerm',
    name: 'example-synapse',
    resource_group_name: 'example-rg',
    location: 'eastus',
    storage_data_lake_gen2_filesystem_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Storage/storageAccounts/examplestorageaccount/blobServices/default/containers/example-filesystem',
    sql_administrator_login: 'sqladminuser',
    sql_administrator_login_password: 'Password1234!',
    managed_virtual_network_enabled: true,
    tags: {
      environment: 'production',
    },
  },

  azurerm_synapse_sql_pool: {
    provider: 'azurerm',
    name: 'example-sqlpool',
    resource_group_name: 'example-rg',
    workspace_name: 'example-synapse',
    performance_level: 'DW100c',
    create_mode: 'Default',
    collation: 'SQL_Latin1_General_CP1_CI_AS',
    tags: {
      environment: 'production',
    },
  },

  azurerm_hdinsight_hadoop_cluster: {
    provider: 'azurerm',
    name: 'example-hadoop',
    resource_group_name: 'example-rg',
    location: 'eastus',
    cluster_version: '4.0',
    tier: 'Standard',
    component_version: {
      hadoop: '3.1',
    },
    gateway: {
      username: 'adminuser',
      password: 'Password1234!',
    },
    storage_account: [
      {
        storage_account_key: 'example-key',
        storage_container_id: '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/example-rg/providers/Microsoft.Storage/storageAccounts/examplestorageaccount/blobServices/default/containers/example-container',
        is_default: true,
      },
    ],
    roles: {
      head_node: {
        vm_size: 'Standard_D3_V2',
        username: 'adminuser',
        password: 'Password1234!',
      },
      worker_node: {
        vm_size: 'Standard_D3_V2',
        username: 'adminuser',
        password: 'Password1234!',
        target_instance_count: 2,
      },
      zookeeper_node: {
        vm_size: 'Standard_D3_V2',
        username: 'adminuser',
        password: 'Password1234!',
      },
    },
    tags: {
      environment: 'production',
    },
  },

  azurerm_stream_analytics_job: {
    provider: 'azurerm',
    name: 'example-analytics',
    resource_group_name: 'example-rg',
    location: 'eastus',
    streaming_units: 1,
    transformation_query: 'SELECT * INTO [YourOutputAlias] FROM [YourInputAlias]',
    tags: {
      environment: 'production',
    },
  },

  // Monitoring Resources
  azurerm_application_insights: {
    provider: 'azurerm',
    name: '${var.appinsights_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    application_type: 'web',

    depends_on: ['azurerm_resource_group.main'],
  },

  azurerm_monitor_action_group: {
    provider: 'azurerm',
    name: '${var.action_group_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    short_name: 'p0action',

    email_receiver: {
      name: 'sendtoadmin',
      email_address: '${var.alert_email}',
    },

    depends_on: ['azurerm_resource_group.main'],
  },

  // Integration Resources
  azurerm_eventhub_namespace: {
    provider: 'azurerm',
    name: '${var.eventhub_name}',
    resource_group_name: '${azurerm_resource_group.main.name}',
    location: '${azurerm_resource_group.main.location}',
    sku: 'Standard',
    capacity: 1,

    network_rulesets: {
      default_action: 'Deny',
      virtual_network_rule: {
        subnet_id: '${azurerm_subnet.main.id}',
      },
    },

    depends_on: [
      'azurerm_resource_group.main',
      'azurerm_subnet.main'
    ],
  },
} 