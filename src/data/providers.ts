import { Provider } from '@/types/cloud'

export const providers: Record<string, Provider> = {
  aws: {
    source: 'hashicorp/aws',
    version: '~> 5.0',
    configuration: {
      region: '${var.aws_region}',
      access_key: '${var.aws_access_key}',
      secret_key: '${var.aws_secret_key}',
      assume_role: {
        role_arn: '${var.aws_role_arn}',
        session_name: '${var.aws_session_name}',
      },
      default_tags: {
        tags: {
          Environment: '${var.environment}',
          Project: '${var.project_name}',
          ManagedBy: 'Terraform',
        },
      },
    },
  },
  azurerm: {
    source: 'hashicorp/azurerm',
    version: '~> 3.0',
    configuration: {
      subscription_id: '${var.azure_subscription_id}',
      client_id: '${var.azure_client_id}',
      client_secret: '${var.azure_client_secret}',
      tenant_id: '${var.azure_tenant_id}',
      features: {},
      default_tags: {
        tags: {
          Environment: '${var.environment}',
          Project: '${var.project_name}',
          ManagedBy: 'Terraform',
        },
      },
    },
  },
  google: {
    source: 'hashicorp/google',
    version: '~> 5.0',
    configuration: {
      project: '${var.gcp_project_id}',
      region: '${var.gcp_region}',
      zone: '${var.gcp_zone}',
      credentials: '${var.gcp_credentials_file}',
      default_labels: {
        environment: '${var.environment}',
        project: '${var.project_name}',
        managed_by: 'terraform',
      },
    },
  },
} 