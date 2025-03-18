import { generateUUID } from '@/lib/utils'
import { CloudResource, Region, TerraformResource, TerraformStateFile } from '@/types/cloud'
import crypto from 'crypto'

export const gcpRegions: Region[] = [
  { id: 'us-east1', name: 'US East (South Carolina)', code: 'us-east1', provider: 'gcp' },
  { id: 'us-east4', name: 'US East (Northern Virginia)', code: 'us-east4', provider: 'gcp' },
  { id: 'us-central1', name: 'US Central (Iowa)', code: 'us-central1', provider: 'gcp' },
  { id: 'us-west1', name: 'US West (Oregon)', code: 'us-west1', provider: 'gcp' },
  { id: 'us-west2', name: 'US West (Los Angeles)', code: 'us-west2', provider: 'gcp' },
  { id: 'us-west3', name: 'US West (Salt Lake City)', code: 'us-west3', provider: 'gcp' },
  { id: 'us-west4', name: 'US West (Las Vegas)', code: 'us-west4', provider: 'gcp' },
  { id: 'northamerica-northeast1', name: 'North America (Montreal)', code: 'northamerica-northeast1', provider: 'gcp' },
  { id: 'southamerica-east1', name: 'South America (São Paulo)', code: 'southamerica-east1', provider: 'gcp' },
  { id: 'europe-west1', name: 'Europe (Belgium)', code: 'europe-west1', provider: 'gcp' },
  { id: 'europe-west2', name: 'Europe (London)', code: 'europe-west2', provider: 'gcp' },
  { id: 'europe-west3', name: 'Europe (Frankfurt)', code: 'europe-west3', provider: 'gcp' },
  { id: 'europe-west4', name: 'Europe (Netherlands)', code: 'europe-west4', provider: 'gcp' },
  { id: 'europe-west6', name: 'Europe (Zurich)', code: 'europe-west6', provider: 'gcp' },
  { id: 'europe-north1', name: 'Europe (Finland)', code: 'europe-north1', provider: 'gcp' },
  { id: 'asia-east1', name: 'Asia (Taiwan)', code: 'asia-east1', provider: 'gcp' },
  { id: 'asia-east2', name: 'Asia (Hong Kong)', code: 'asia-east2', provider: 'gcp' },
  { id: 'asia-northeast1', name: 'Asia (Tokyo)', code: 'asia-northeast1', provider: 'gcp' },
  { id: 'asia-northeast2', name: 'Asia (Osaka)', code: 'asia-northeast2', provider: 'gcp' },
  { id: 'asia-northeast3', name: 'Asia (Seoul)', code: 'asia-northeast3', provider: 'gcp' },
  { id: 'asia-south1', name: 'Asia (Mumbai)', code: 'asia-south1', provider: 'gcp' },
  { id: 'asia-southeast1', name: 'Asia (Singapore)', code: 'asia-southeast1', provider: 'gcp' },
  { id: 'asia-southeast2', name: 'Asia (Jakarta)', code: 'asia-southeast2', provider: 'gcp' },
  { id: 'australia-southeast1', name: 'Australia (Sydney)', code: 'australia-southeast1', provider: 'gcp' },
]

const generateId = (prefix: string, index: number, region: string): string => {
  const uniqueHash = crypto
    .createHash('sha256')
    .update(`${prefix}-${region}-${index}-${Date.now()}`)
    .digest('hex')
    .substring(0, 8)
  return `${prefix}-${uniqueHash}`
}

export const generateNetwork = (
  projectId: string,
  region: string,
  networkIndex: number
): TerraformResource => {
  const networkId = generateId('network', networkIndex, region)
  const name = `network-${region}-${networkIndex}`

  return {
    mode: 'managed',
    type: 'google_compute_network',
    name: `network_${networkIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/google"]',
    instances: [
      {
        schema_version: 0,
        attributes: {
          id: networkId,
          name: name,
          project: projectId,
          auto_create_subnetworks: false,
          delete_default_routes_on_create: false,
          description: `Network for ${region}`,
          mtu: 1460,
          routing_mode: 'REGIONAL',
          timeouts: {
            create: '30m',
            update: '30m',
            delete: '30m',
          },
        },
      },
    ],
  }
}

export const generateInstance = (
  projectId: string,
  region: string,
  instanceIndex: number
): TerraformResource => {
  const instanceId = generateId('instance', instanceIndex, region)
  const name = `instance-${region}-${instanceIndex}`

  return {
    mode: 'managed',
    type: 'google_compute_instance',
    name: `instance_${instanceIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/google"]',
    instances: [
      {
        schema_version: 6,
        attributes: {
          id: instanceId,
          name: name,
          project: projectId,
          zone: `${region}-a`,
          machine_type: 'e2-medium',
          allow_stopping_for_update: true,
          boot_disk: {
            auto_delete: true,
            initialize_params: {
              image: 'debian-cloud/debian-11',
              size: 20,
              type: 'pd-standard',
            },
          },
          network_interface: [
            {
              network: 'default',
              access_config: [{}],
            },
          ],
          scheduling: {
            automatic_restart: true,
            on_host_maintenance: 'MIGRATE',
            preemptible: false,
          },
          tags: ['web', 'app'],
          timeouts: {
            create: '30m',
            update: '30m',
            delete: '30m',
          },
        },
      },
    ],
  }
}

export const generateGCPStateFile = (
  regions: string[] = ['us-central1'],
  selectedResources: CloudResource[],
  projectId: string = 'my-project-id'
): TerraformStateFile => {
  const resources: TerraformResource[] = []
  const resourceCounts: Record<string, number> = {}

  for (const region of regions) {
    for (const resource of selectedResources) {
      const count = resourceCounts[resource.type] || 0
      resourceCounts[resource.type] = count + 1

      switch (resource.type) {
        case 'google_compute_network':
          resources.push(generateNetwork(projectId, region, count))
          break
        case 'google_compute_instance':
          resources.push(generateInstance(projectId, region, count))
          break
        // Add more resource types here...
      }
    }
  }

  return {
    version: 4,
    terraform_version: '1.5.0',
    serial: 1,
    lineage: generateUUID(),
    outputs: {},
    resources,
  }
} 