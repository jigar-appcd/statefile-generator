import { awsCategories, azureCategories, gcpCategories } from '@/data/categories'
import { awsRegions } from '@/lib/providers/aws'
import { azureRegions } from '@/lib/providers/azure'
import { gcpRegions } from '@/lib/providers/gcp'
import { generateResourceId } from '@/lib/resource-handlers/base-handler'
import { ResourceHandlerFactory } from '@/lib/resource-handlers/handler-factory'
import { CloudProvider, CloudResource, Region } from '@/types/cloud'
import { useMemo, useState } from 'react'

interface TerraformState {
  version: number
  terraform_version: string
  serial: number
  lineage: string
  outputs: Record<string, unknown>
  resources: TerraformResource[]
  provider_config: Record<string, ProviderConfig>
}

interface TerraformResource {
  mode: string
  type: string
  name: string
  provider: string
  instances: TerraformInstance[]
}

interface TerraformInstance {
  schema_version: number
  attributes: Record<string, unknown>
  dependencies?: string[]
}

interface ProviderConfig {
  name: string
  full_name: string
  version: string
  expressions: Record<string, unknown>
}

export function useStateGenerator() {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('aws')
  const [selectedResources, setSelectedResources] = useState<CloudResource[]>(() => {
    // Initialize with all AWS resources
    return awsCategories.flatMap(category => category.resources)
  })
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(() => {
    // Initialize with us-east-1 region
    return [awsRegions.find(r => r.code === 'us-east-1')!]
  })
  const [includeConnections, setIncludeConnections] = useState(true)

  const categories = useMemo(() => {
    switch (selectedProvider) {
      case 'aws':
        return awsCategories
      case 'azure':
        return azureCategories
      case 'gcp':
        return gcpCategories
      default:
        return awsCategories // Default to AWS categories
    }
  }, [selectedProvider])

  const regions = useMemo(() => {
    switch (selectedProvider) {
      case 'aws':
        return awsRegions
      case 'azure':
        return azureRegions
      case 'gcp':
        return gcpRegions
      default:
        return awsRegions // Default to AWS regions
    }
  }, [selectedProvider])

  const generateStateFile = useMemo(() => {
    return (resources: CloudResource[], regions: Region[], includeConnections: boolean, totalCount: number = 1) => {
      if (!resources.length || !regions.length) {
        return null
      }

      const state: TerraformState = {
        version: 4,
        terraform_version: "1.1.9",
        serial: Math.floor(Math.random() * 1000),
        lineage: crypto.randomUUID(),
        outputs: {},
        resources: [],
        provider_config: {
          "registry.terraform.io/hashicorp/aws": {
            name: "aws",
            full_name: "registry.terraform.io/hashicorp/aws",
            version: "5.31.0",
            expressions: {
              region: regions[0].code
            }
          },
          "registry.terraform.io/hashicorp/azurerm": {
            name: "azurerm",
            full_name: "registry.terraform.io/hashicorp/azurerm",
            version: "3.85.0",
            expressions: {
              features: {}
            }
          },
          "registry.terraform.io/hashicorp/google": {
            name: "google",
            full_name: "registry.terraform.io/hashicorp/google",
            version: "5.10.0",
            expressions: {
              region: regions[0].code
            }
          }
        }
      }

      // First, ensure we have the basic networking resources if connections are included
      if (includeConnections && resources[0]?.provider) {
        switch (resources[0].provider) {
          case 'aws':
            addAWSBaseResources(state, regions[0])
            break
          case 'azure':
            addAzureBaseResources(state, regions[0])
            break
          case 'gcp':
            addGCPBaseResources(state, regions[0])
            break
        }
      }

      regions.forEach(region => {
        for (let i = 0; i < totalCount; i++) {
          const randomResourceIndex = Math.floor(Math.random() * resources.length)
          const selectedResource = resources[randomResourceIndex]
          const resourceState = generateResourceState(selectedResource, region, i)

          // Add dependencies based on resource type and provider
          if (includeConnections && selectedResource.provider) {
            switch (selectedResource.provider) {
              case 'aws':
                switch (selectedResource.type) {
                  case 'aws_instance':
                    resourceState.instances[0].dependencies = [
                      'aws_vpc.main',
                      'aws_subnet.main',
                      'aws_security_group.default'
                    ]
                    break
                  case 'aws_lambda_function':
                    resourceState.instances[0].dependencies = [
                      'aws_iam_role.lambda',
                      'aws_security_group.lambda'
                    ]
                    break
                  case 'aws_eks_cluster':
                    resourceState.instances[0].dependencies = [
                      'aws_vpc.main',
                      'aws_subnet.main',
                      'aws_security_group.default',
                      'aws_iam_role.eks_cluster'
                    ]
                    break
                }
                break
              case 'azure':
                switch (selectedResource.type) {
                  case 'azurerm_virtual_machine':
                    resourceState.instances[0].dependencies = [
                      'azurerm_resource_group.main',
                      'azurerm_virtual_network.main',
                      'azurerm_subnet.main',
                      'azurerm_network_security_group.main'
                    ]
                    break
                  case 'azurerm_kubernetes_cluster':
                    resourceState.instances[0].dependencies = [
                      'azurerm_resource_group.main',
                      'azurerm_virtual_network.main',
                      'azurerm_subnet.main',
                      'azurerm_user_assigned_identity.aks'
                    ]
                    break
                }
                break
              case 'gcp':
                switch (selectedResource.type) {
                  case 'google_compute_instance':
                    resourceState.instances[0].dependencies = [
                      'google_compute_network.main',
                      'google_compute_subnetwork.main'
                    ]
                    break
                  case 'google_container_cluster':
                    resourceState.instances[0].dependencies = [
                      'google_compute_network.main',
                      'google_compute_subnetwork.main',
                      'google_service_account.gke'
                    ]
                    break
                }
                break
            }
          }

          state.resources.push(resourceState)
        }
      })

      // Add supporting resources for connections
      if (includeConnections && resources[0]?.provider) {
        switch (resources[0].provider) {
          case 'aws':
            addAWSConnections(state)
            break
          case 'azure':
            addAzureConnections(state)
            break
          case 'gcp':
            addGCPConnections(state)
            break
        }
      }

      // Add dependencies for all resources
      if (includeConnections) {
        addDependencies(state)
      }

      return state
    }
  }, [])

  return {
    provider: selectedProvider,
    setProvider: setSelectedProvider,
    selectedResources,
    setSelectedResources,
    selectedRegions,
    setSelectedRegions,
    includeConnections,
    setIncludeConnections,
    generateStateFile,
    categories,
    regions,
  }
}

function generateResourceState(resource: CloudResource, region: Region, index: number = 0): TerraformResource {
  const providerMapping: Record<CloudProvider, string> = {
    aws: 'provider["registry.terraform.io/hashicorp/aws"]',
    azure: 'provider["registry.terraform.io/hashicorp/azurerm"]',
    gcp: 'provider["registry.terraform.io/hashicorp/google"]'
  }

  const baseState: TerraformResource = {
    mode: "managed",
    type: resource.type,
    name: `${resource.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${index}`,
    provider: resource.provider ? providerMapping[resource.provider] : 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: []
  }

  const handler = ResourceHandlerFactory.getHandler(resource)
  const attributes = resource.provider === 'aws' ? handler.getAttributes(resource.name) : handler.getAttributes(resource.name, region)

  baseState.instances.push({
    schema_version: 1,
    attributes: attributes
  })

  return baseState
}

function generateAccountId(): string {
  return '123456789012' // Default AWS account ID for testing
}

function addDependencies(state: TerraformState) {
  state.resources.forEach(resource => {
    const provider = resource.provider.split('/').pop()?.replace(/[\[\]"]/g, '')
    switch (provider) {
      case 'aws':
        switch (resource.type) {
          case 'aws_instance':
            resource.instances[0].dependencies = [
              'module.network.aws_vpc.vnet',
              'module.network.aws_subnet.subnet_for_each["system"]',
              'module.network.aws_security_group.default',
              'module.network.aws_network_interface.main'
            ]
            break
          case 'aws_lambda_function':
            resource.instances[0].dependencies = [
              'module.network.aws_security_group.default',
              'aws_iam_role.lambda'
            ]
            break
          case 'aws_db_instance':
            resource.instances[0].dependencies = [
              'module.network.aws_db_subnet_group.default',
              'module.network.aws_security_group.default',
              'module.network.aws_vpc.vnet'
            ]
            break
          case 'aws_eks_cluster':
            resource.instances[0].dependencies = [
              'module.network.aws_vpc.vnet',
              'module.network.aws_subnet.subnet_for_each["system"]',
              'module.network.aws_security_group.default',
              'aws_iam_role.eks_cluster'
            ]
            break
        }
        break
      case 'azurerm':
        switch (resource.type) {
          case 'azurerm_virtual_machine':
            resource.instances[0].dependencies = [
              'azurerm_resource_group.this',
              'module.network.azurerm_virtual_network.vnet',
              'module.network.azurerm_subnet.subnet_for_each["system"]',
              'azurerm_network_security_group.main'
            ]
            break
          case 'azurerm_kubernetes_cluster':
            resource.instances[0].dependencies = [
              'azurerm_resource_group.this',
              'module.network.azurerm_virtual_network.vnet', 
              'module.network.azurerm_subnet.subnet_for_each["system"]',
              'azurerm_user_assigned_identity.aks'
            ]
            break
          case 'azurerm_postgresql_flexible_server':
            resource.instances[0].dependencies = [
              'azurerm_resource_group.this',
              'module.network.azurerm_private_dns_zone.this',
              'module.network.azurerm_private_dns_zone_virtual_network_link.this',
              'module.network.data.azurerm_subnet.subnet-pgsql'
            ]
            break
        }
        break
      case 'google':
        switch (resource.type) {
          case 'google_compute_instance':
            resource.instances[0].dependencies = [
              'google_compute_network.main',
              'google_compute_subnetwork.main'
            ]
            break
          case 'google_container_cluster':
            resource.instances[0].dependencies = [
              'google_compute_network.main',
              'google_compute_subnetwork.main',
              'google_service_account.gke'
            ]
            break
        }
        break
    }
  })
}

function addAWSBaseResources(state: TerraformState, region: Region) {
  // Add VPC
  state.resources.push({
    mode: "managed",
    type: "aws_vpc",
    name: "vnet",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 1,
      attributes: {
        id: generateResourceId('vpc'),
        cidr_block: "10.52.0.0/16",
        enable_dns_hostnames: true,
        enable_dns_support: true,
        instance_tenancy: "default",
        tags: {
          module: "cluster",
          purpose: "stackgen_aws_enterprise",
          supported_by: "support@stackgen.com"
        }
      }
    }]
  })

  // Add subnet
  state.resources.push({
    mode: "managed",
    type: "aws_subnet",
    name: "subnet_for_each",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 1,
      attributes: {
        id: generateResourceId('subnet'),
        vpc_id: "${aws_vpc.vnet.id}",
        cidr_block: "10.52.0.0/20",
        availability_zone: `${region.code}a`,
        map_public_ip_on_launch: false,
        tags: {
          module: "cluster",
          purpose: "stackgen_aws_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["aws_vpc.vnet"]
    }]
  })

  // Add security group
  state.resources.push({
    mode: "managed",
    type: "aws_security_group",
    name: "default",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 1,
      attributes: {
        id: generateResourceId('sg'),
        name: "default",
        description: "Default security group",
        vpc_id: "${aws_vpc.vnet.id}",
        ingress: [{
          from_port: 0,
          to_port: 0,
          protocol: "-1",
          cidr_blocks: ["10.52.0.0/16"],
          description: "Allow all internal traffic",
          ipv6_cidr_blocks: [],
          prefix_list_ids: [],
          security_groups: []
        }],
        egress: [{
          from_port: 0,
          to_port: 0,
          protocol: "-1",
          cidr_blocks: ["0.0.0.0/0"],
          description: "Allow all outbound traffic",
          ipv6_cidr_blocks: [],
          prefix_list_ids: [],
          security_groups: []
        }],
        tags: {
          module: "cluster",
          purpose: "stackgen_aws_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["aws_vpc.vnet"]
    }]
  })

  // Add IAM roles
  state.resources.push({
    mode: "managed",
    type: "aws_iam_role",
    name: "lambda",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('role'),
        name: "lambda-execution-role",
        assume_role_policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com"
            }
          }]
        }),
        inline_policy: [],
        managed_policy_arns: [
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
        ],
        tags: {
          module: "cluster",
          purpose: "stackgen_aws_enterprise",
          supported_by: "support@stackgen.com"
        }
      }
    }]
  })
}

function addAzureBaseResources(state: TerraformState, region: Region) {
  // Add resource group
  state.resources.push({
    mode: "managed",
    type: "azurerm_resource_group",
    name: "this",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('rg'),
        name: "sks-stackgen-rg",
        location: region.code,
        tags: {
          module: "cluster",
          purpose: "stackgen_azure_enterprise",
          supported_by: "support@stackgen.com"
        }
      }
    }]
  })

  // Add virtual network
  state.resources.push({
    mode: "managed",
    type: "azurerm_virtual_network",
    name: "vnet",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('vnet'),
        name: "sks-stackgen-rg",
        resource_group_name: "sks-stackgen-rg",
        location: region.code,
        address_space: ["10.52.0.0/16"],
        dns_servers: [],
        bgp_community: "",
        edge_zone: "",
        flow_timeout_in_minutes: 0,
        tags: {
          module: "cluster",
          purpose: "stackgen_azure_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["azurerm_resource_group.this"]
    }]
  })

  // Add subnet
  state.resources.push({
    mode: "managed",
    type: "azurerm_subnet",
    name: "subnet_for_each",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('subnet'),
        name: "system",
        resource_group_name: "sks-stackgen-rg",
        virtual_network_name: "sks-stackgen-rg",
        address_prefixes: ["10.52.0.0/20"],
        delegation: [],
        private_endpoint_network_policies_enabled: true,
        private_link_service_network_policies_enabled: true,
        service_endpoints: ["Microsoft.Sql"],
        service_endpoint_policy_ids: []
      },
      dependencies: [
        "azurerm_resource_group.this",
        "azurerm_virtual_network.vnet"
      ]
    }]
  })

  // Add network security group
  state.resources.push({
    mode: "managed",
    type: "azurerm_network_security_group",
    name: "main",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('nsg'),
        name: "main-nsg",
        location: region.code,
        resource_group_name: "sks-stackgen-rg",
        security_rule: [{
          name: "allow_ssh",
          priority: 100,
          direction: "Inbound",
          access: "Allow",
          protocol: "Tcp",
          source_port_range: "*",
          destination_port_range: "22",
          source_address_prefix: "*",
          destination_address_prefix: "*"
        }],
        tags: {
          module: "cluster",
          purpose: "stackgen_azure_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["azurerm_resource_group.this"]
    }]
  })

  // Add private DNS zone
  state.resources.push({
    mode: "managed",
    type: "azurerm_private_dns_zone",
    name: "this",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('dns'),
        name: "privatelink.postgres.database.azure.com",
        resource_group_name: "sks-stackgen-rg",
        soa_record: [],
        tags: {
          module: "cluster",
          purpose: "stackgen_azure_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["azurerm_resource_group.this"]
    }]
  })
}

function addGCPBaseResources(state: TerraformState, region: Region) {
  // Add VPC
  state.resources.push({
    mode: "managed",
    type: "google_compute_network",
    name: "main",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('vpc'),
        name: "vpc-main",
        project: "my-project",
        routing_mode: "REGIONAL",
        auto_create_subnetworks: false,
        mtu: 1460,
        delete_default_routes_on_create: false,
        enable_ula_internal_ipv6: false,
        internal_ipv6_range: "",
        network_firewall_policy_enforcement_order: "AFTER_CLASSIC_FIREWALL",
        tags: {
          module: "cluster",
          purpose: "stackgen_gcp_enterprise",
          supported_by: "support@stackgen.com"
        }
      }
    }]
  })

  // Add subnet
  state.resources.push({
    mode: "managed",
    type: "google_compute_subnetwork",
    name: "main",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('subnet'),
        name: "subnet-main",
        network: "vpc-main",
        project: "my-project",
        region: region.code,
        ip_cidr_range: "10.52.0.0/20",
        private_ip_google_access: true,
        private_ipv6_google_access: "DISABLE_GOOGLE_ACCESS",
        purpose: "PRIVATE",
        role: "",
        secondary_ip_range: [],
        stack_type: "IPV4_ONLY",
        tags: {
          module: "cluster",
          purpose: "stackgen_gcp_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["google_compute_network.main"]
    }]
  })

  // Add firewall rules
  state.resources.push({
    mode: "managed",
    type: "google_compute_firewall",
    name: "allow_internal",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 1,
      attributes: {
        id: generateResourceId('fw'),
        name: "allow-internal",
        network: "vpc-main",
        project: "my-project",
        description: "Allow internal traffic on the network",
        direction: "INGRESS",
        source_ranges: ["10.52.0.0/16"],
        destination_ranges: [],
        allow: [{
          protocol: "tcp",
          ports: ["0-65535"]
        }, {
          protocol: "udp",
          ports: ["0-65535"]
        }, {
          protocol: "icmp"
        }],
        deny: [],
        priority: 1000,
        source_tags: [],
        source_service_accounts: [],
        target_tags: [],
        target_service_accounts: [],
        tags: {
          module: "cluster",
          purpose: "stackgen_gcp_enterprise",
          supported_by: "support@stackgen.com"
        }
      },
      dependencies: ["google_compute_network.main"]
    }]
  })

  // Add service account
  state.resources.push({
    mode: "managed",
    type: "google_service_account",
    name: "gke",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: generateResourceId('sa'),
        account_id: "gke-service-account",
        display_name: "GKE Service Account",
        project: "my-project",
        description: "Service account for GKE cluster",
        disabled: false,
        name: "projects/my-project/serviceAccounts/gke-service-account@my-project.iam.gserviceaccount.com",
        email: "gke-service-account@my-project.iam.gserviceaccount.com",
        tags: {
          module: "cluster",
          purpose: "stackgen_gcp_enterprise",
          supported_by: "support@stackgen.com"
        }
      }
    }]
  })
}

function addAWSConnections(state: TerraformState) {
  addDataSources(state)
  addRouteTables(state)
  addSecurityGroups(state)
  addEBSVolumes(state)
  addNetworkInterface(state)
  addDBSubnetGroup(state)
  addDBSecurityGroup(state)
  addTargetGroups(state)
  addAutoScalingGroup(state)
}

function addRouteTables(state: TerraformState) {
  const routeTableId = generateResourceId('rt')
  state.resources.push({
    mode: "managed",
    type: "aws_route_table",
    name: "main",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: routeTableId,
        vpc_id: "${aws_vpc.vnet.id}",
        route: [
          {
            carrier_gateway_id: "",
            cidr_block: "0.0.0.0/0",
            core_network_arn: "",
            destination_prefix_list_id: "",
            egress_only_gateway_id: "",
            gateway_id: "${aws_internet_gateway.main.id}",
            instance_id: "",
            ipv6_cidr_block: "",
            local_gateway_id: "",
            nat_gateway_id: "",
            network_interface_id: "",
            transit_gateway_id: "",
            vpc_endpoint_id: "",
            vpc_peering_connection_id: ""
          }
        ],
        tags: {
          Name: "main",
          Environment: "production",
          ManagedBy: "terraform"
        },
        tags_all: {
          Name: "main",
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["aws_vpc.vnet", "aws_internet_gateway.main"]
    }]
  })
}

function addSecurityGroups(state: TerraformState) {
  const sgId = generateResourceId('sg')
  state.resources.push({
    mode: "managed",
    type: "aws_security_group",
    name: `default_${sgId}`,
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 1,
      attributes: {
        id: sgId,
        name: "default",
        description: "Default security group",
        vpc_id: "${aws_vpc.main.id}",
        ingress: [],
        egress: [{
          from_port: 0,
          to_port: 0,
          protocol: "-1",
          cidr_blocks: ["0.0.0.0/0"]
        }],
        tags: {
          Name: "default"
        }
      },
      dependencies: ["aws_vpc.main"]
    }]
  })
}

function addEBSVolumes(state: TerraformState) {
  const volumeId = generateResourceId('vol')
  state.resources.push({
    mode: "managed",
    type: "aws_ebs_volume",
    name: "data",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: volumeId,
        availability_zone: "${data.aws_availability_zones.available.names[0]}",
        encrypted: true,
        final_snapshot: true,
        iops: 3000,
        multi_attach_enabled: false,
        size: 20,
        snapshot_id: null,
        type: "gp3",
        throughput: 125,
        outpost_arn: null,
        kms_key_id: null,
        tags: {
          Name: "data",
          Environment: "production",
          ManagedBy: "terraform"
        },
        tags_all: {
          Name: "data",
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["data.aws_availability_zones.available"]
    }]
  })
}

function addNetworkInterface(state: TerraformState) {
  const nicId = generateResourceId('nic')
  state.resources.push({
    mode: "managed",
    type: "aws_network_interface",
    name: `main_${nicId}`,
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: nicId,
        description: "Primary network interface",
        subnet_id: "${aws_subnet.main.id}",
        private_ip: "10.0.1.10",
        private_ips: ["10.0.1.10"],
        private_ips_count: 0,
        security_groups: ["${aws_security_group.default.id}"],
        source_dest_check: true,
        interface_type: "interface",
        ipv4_prefix_count: 0,
        ipv4_prefixes: [],
        ipv6_address_count: 0,
        ipv6_addresses: [],
        ipv6_prefix_count: 0,
        ipv6_prefixes: [],
        attachment: {
          instance: "",
          device_index: 0,
          network_card_index: 0
        },
        tags: {
          Name: "main",
          Environment: "production",
          ManagedBy: "terraform"
        },
        tags_all: {
          Name: "main",
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["aws_subnet.main", "aws_security_group.default"]
    }]
  })
}

function addDBSubnetGroup(state: TerraformState) {
  const subnetGroupId = generateResourceId('subnet_group')
  const region = 'us-east-1' // Default region if not specified
  state.resources.push({
    mode: "managed",
    type: "aws_db_subnet_group",
    name: `default_${subnetGroupId}`,
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: subnetGroupId,
        name: "default",
        name_prefix: null,
        description: "Default DB subnet group",
        subnet_ids: ["${aws_subnet.main.id}"],
        supported_network_types: ["IPV4"],
        vpc_id: "${aws_vpc.main.id}",
        arn: `arn:aws:rds:${region}:${generateAccountId()}:subgrp:default`,
        tags: {
          Name: "default",
          Environment: "production",
          ManagedBy: "terraform"
        },
        tags_all: {
          Name: "default",
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["aws_subnet.main", "aws_vpc.main"]
    }]
  })
}

function addDBSecurityGroup(state: TerraformState) {
  const dbSgId = generateResourceId('db_sg')
  state.resources.push({
    mode: "managed",
    type: "aws_db_security_group",
    name: `default_${dbSgId}`,
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: dbSgId,
        name: "default",
        ingress: [{
          cidr: "10.0.0.0/16",
          security_group_name: "${aws_security_group.default.name}"
        }],
        tags: {
          Name: "default"
        }
      },
      dependencies: ["aws_security_group.default"]
    }]
  })
}

function addTargetGroups(state: TerraformState) {
  const tgId = generateResourceId('tg')
  const region = 'us-east-1' // Default region if not specified
  state.resources.push({
    mode: "managed",
    type: "aws_lb_target_group",
    name: `app_${tgId}`,
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: tgId,
        arn: `arn:aws:elasticloadbalancing:${region}:${generateAccountId()}:targetgroup/app/${tgId}`,
        arn_suffix: `targetgroup/app/${tgId}`,
        connection_termination: false,
        deregistration_delay: "300",
        health_check: {
          enabled: true,
          healthy_threshold: 3,
          interval: 30,
          matcher: "200",
          path: "/health",
          port: "traffic-port",
          protocol: "HTTP",
          timeout: 5,
          unhealthy_threshold: 3
        },
        ip_address_type: "ipv4",
        lambda_multi_value_headers_enabled: false,
        load_balancing_algorithm_type: "round_robin",
        name: "app",
        name_prefix: null,
        port: 80,
        preserve_client_ip: true,
        protocol: "HTTP",
        protocol_version: "HTTP1",
        proxy_protocol_v2: false,
        slow_start: 0,
        stickiness: {
          cookie_duration: 86400,
          cookie_name: null,
          enabled: false,
          type: "lb_cookie"
        },
        target_failover: {
          on_deregistration: "rebalance",
          on_unhealthy: "rebalance"
        },
        target_type: "instance",
        vpc_id: "${aws_vpc.main.id}",
        tags: {
          Name: "app",
          Environment: "production",
          ManagedBy: "terraform"
        },
        tags_all: {
          Name: "app",
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["aws_vpc.main"]
    }]
  })
}

function addAutoScalingGroup(state: TerraformState) {
  const asgId = generateResourceId('asg')
  state.resources.push({
    mode: "managed",
    type: "aws_autoscaling_group",
    name: "main",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        id: asgId,
        name: "main-asg",
        desired_capacity: 2,
        max_size: 4,
        min_size: 1,
        default_cooldown: 300,
        health_check_grace_period: 300,
        health_check_type: "EC2",
        force_delete: false,
        launch_template: {
          id: "${aws_launch_template.main.id}",
          version: "$Latest"
        },
        vpc_zone_identifier: ["${aws_subnet.subnet_for_each.id}"],
        target_group_arns: [],
        termination_policies: ["Default"],
        enabled_metrics: [
          "GroupMinSize",
          "GroupMaxSize",
          "GroupDesiredCapacity",
          "GroupInServiceInstances",
          "GroupPendingInstances",
          "GroupStandbyInstances",
          "GroupTerminatingInstances",
          "GroupTotalInstances"
        ],
        metrics_granularity: "1Minute",
        service_linked_role_arn: "",
        wait_for_capacity_timeout: "10m",
        protect_from_scale_in: false,
        max_instance_lifetime: 0,
        capacity_rebalance: true,
        tags: [
          {
            key: "Name",
            value: "main-asg",
            propagate_at_launch: true
          },
          {
            key: "Environment",
            value: "production",
            propagate_at_launch: true
          }
        ]
      },
      dependencies: [
        "aws_launch_template.main",
        "aws_subnet.subnet_for_each"
      ]
    }]
  })
}

// Add data source for availability zones
function addDataSources(state: TerraformState) {
  state.resources.push({
    mode: "data",
    type: "aws_availability_zones",
    name: "available",
    provider: "provider[\"registry.terraform.io/hashicorp/aws\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        state: "available",
        names: ["us-east-1a", "us-east-1b", "us-east-1c"],
        zone_ids: ["use1-az1", "use1-az2", "use1-az3"]
      }
    }]
  })
}

function addAzureConnections(state: TerraformState) {
  // Add network security group
  state.resources.push({
    mode: "managed",
    type: "azurerm_network_security_group",
    name: "main",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        name: "main-nsg",
        location: "${azurerm_resource_group.main.location}",
        resource_group_name: "${azurerm_resource_group.main.name}",
        security_rule: [
          {
            name: "allow_ssh",
            priority: 100,
            direction: "Inbound",
            access: "Allow",
            protocol: "Tcp",
            source_port_range: "*",
            destination_port_range: "22",
            source_address_prefix: "*",
            destination_address_prefix: "*"
          }
        ],
        tags: {
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["azurerm_resource_group.main"]
    }]
  })

  // Add user assigned identity
  state.resources.push({
    mode: "managed",
    type: "azurerm_user_assigned_identity",
    name: "aks",
    provider: "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        name: "aks-identity",
        location: "${azurerm_resource_group.main.location}",
        resource_group_name: "${azurerm_resource_group.main.name}",
        tags: {
          Environment: "production",
          ManagedBy: "terraform"
        }
      },
      dependencies: ["azurerm_resource_group.main"]
    }]
  })
}

function addGCPConnections(state: TerraformState) {
  // Add firewall rules
  state.resources.push({
    mode: "managed",
    type: "google_compute_firewall",
    name: "allow_internal",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        name: "allow-internal",
        network: "${google_compute_network.main.name}",
        source_ranges: ["10.0.0.0/8"],
        allow: [
          {
            protocol: "tcp",
            ports: ["0-65535"]
          },
          {
            protocol: "udp",
            ports: ["0-65535"]
          },
          {
            protocol: "icmp"
          }
        ],
        target_tags: ["internal"],
        description: "Allow internal traffic on the network"
      },
      dependencies: ["google_compute_network.main"]
    }]
  })

  // Add Cloud NAT
  state.resources.push({
    mode: "managed",
    type: "google_compute_router",
    name: "router",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        name: "nat-router",
        network: "${google_compute_network.main.id}",
        region: "${google_compute_subnetwork.main.region}",
        bgp: {
          asn: 64514,
          advertise_mode: "CUSTOM",
          advertised_groups: ["ALL_SUBNETS"]
        }
      },
      dependencies: ["google_compute_network.main", "google_compute_subnetwork.main"]
    }]
  })

  state.resources.push({
    mode: "managed",
    type: "google_compute_router_nat",
    name: "nat",
    provider: "provider[\"registry.terraform.io/hashicorp/google\"]",
    instances: [{
      schema_version: 0,
      attributes: {
        name: "nat-config",
        router: "${google_compute_router.router.name}",
        region: "${google_compute_router.router.region}",
        nat_ip_allocate_option: "AUTO_ONLY",
        source_subnetwork_ip_ranges_to_nat: "ALL_SUBNETWORKS_ALL_IP_RANGES",
        min_ports_per_vm: 64,
        udp_idle_timeout_sec: 30,
        tcp_established_idle_timeout_sec: 1200,
        tcp_transitory_idle_timeout_sec: 30
      },
      dependencies: ["google_compute_router.router"]
    }]
  })
} 