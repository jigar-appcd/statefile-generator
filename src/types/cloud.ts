export type ResourceCategory = {
  id: string
  name: string
  description: string
  resources: CloudResource[]
}

export type CloudProvider = 'aws' | 'azure' | 'gcp'

export interface CloudResource {
  id: string
  name: string
  type: string
  provider?: CloudProvider
  category: string
  description: string
  attributes: Record<string, unknown>
  region?: string
}

export type Region = {
  id: string
  name: string
  code: string
  provider: CloudProvider
}

export type ResourceInstance = {
  schema_version: number
  attributes: Record<string, unknown>
}

export type TerraformResource = {
  mode: 'managed' | 'data'
  type: string
  name: string
  provider: string
  instances: ResourceInstance[]
}

export type TerraformStateFile = {
  version: number
  terraform_version: string
  serial: number
  lineage: string
  outputs: Record<string, unknown>
  resources: {
    mode: string
    type: string
    name: string
    provider: string
    instances: {
      schema_version: number
      attributes: Record<string, unknown>
    }[]
  }[]
}

export interface ResourceAttributes {
  [key: string]: string | number | boolean | null | undefined | ResourceAttributes | Array<ResourceAttributes | string | number | boolean>
}

export interface ProviderConfiguration {
  region?: string
  access_key?: string
  secret_key?: string
  project?: string
  zone?: string
  credentials?: string
  subscription_id?: string
  client_id?: string
  client_secret?: string
  tenant_id?: string
  features?: Record<string, unknown>
  assume_role?: {
    role_arn: string
    session_name: string
  }
  default_tags?: {
    tags: Record<string, string>
  }
  default_labels?: Record<string, string>
}

export interface Provider {
  source: string
  version: string
  configuration: ProviderConfiguration
} 