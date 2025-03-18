import { generateUUID } from '@/lib/utils'
import { CloudResource, Region, TerraformResource, TerraformStateFile } from '@/types/cloud'
import crypto from 'crypto'

export const awsRegions: Region[] = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', code: 'us-east-1', provider: 'aws' },
  { id: 'us-east-2', name: 'US East (Ohio)', code: 'us-east-2', provider: 'aws' },
  { id: 'us-west-1', name: 'US West (N. California)', code: 'us-west-1', provider: 'aws' },
  { id: 'us-west-2', name: 'US West (Oregon)', code: 'us-west-2', provider: 'aws' },
  { id: 'af-south-1', name: 'Africa (Cape Town)', code: 'af-south-1', provider: 'aws' },
  { id: 'ap-east-1', name: 'Asia Pacific (Hong Kong)', code: 'ap-east-1', provider: 'aws' },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', code: 'ap-south-1', provider: 'aws' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', code: 'ap-northeast-1', provider: 'aws' },
  { id: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', code: 'ap-northeast-2', provider: 'aws' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1', provider: 'aws' },
  { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', code: 'ap-southeast-2', provider: 'aws' },
  { id: 'ca-central-1', name: 'Canada (Central)', code: 'ca-central-1', provider: 'aws' },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)', code: 'eu-central-1', provider: 'aws' },
  { id: 'eu-west-1', name: 'Europe (Ireland)', code: 'eu-west-1', provider: 'aws' },
  { id: 'eu-west-2', name: 'Europe (London)', code: 'eu-west-2', provider: 'aws' },
  { id: 'eu-west-3', name: 'Europe (Paris)', code: 'eu-west-3', provider: 'aws' },
  { id: 'eu-north-1', name: 'Europe (Stockholm)', code: 'eu-north-1', provider: 'aws' },
  { id: 'me-south-1', name: 'Middle East (Bahrain)', code: 'me-south-1', provider: 'aws' },
  { id: 'sa-east-1', name: 'South America (São Paulo)', code: 'sa-east-1', provider: 'aws' },
]

const generateId = (prefix: string, index: number, region: string): string => {
  const uniqueHash = crypto
    .createHash('sha256')
    .update(`${prefix}-${region}-${index}-${Date.now()}`)
    .digest('hex')
    .substring(0, 8)
  return `${prefix}-${uniqueHash}`
}

const generateArn = (
  region: string,
  accountId: string,
  service: string,
  resourceType: string,
  resourceId: string
): string => {
  return `arn:aws:${service}:${region}:${accountId}:${resourceType}/${resourceId}`
}

export const generateVpc = (
  accountId: string,
  region: string,
  vpcIndex: number
): TerraformResource => {
  const vpcId = generateId('vpc', vpcIndex, region)
  const cidrBlock = `10.${vpcIndex}.0.0/16`

  return {
    mode: 'managed',
    type: 'aws_vpc',
    name: `vpc_${vpcIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 1,
        attributes: {
          arn: generateArn(region, accountId, 'ec2', 'vpc', vpcId),
          id: vpcId,
          cidr_block: cidrBlock,
          enable_dns_hostnames: true,
          enable_dns_support: true,
          instance_tenancy: 'default',
          tags: {
            Name: `vpc-${region}-${vpcIndex}`,
            Environment: 'production',
          },
        } as const,
      },
    ],
  }
}

export const generateEc2Instance = (
  accountId: string,
  region: string,
  instanceIndex: number
): TerraformResource => {
  const instanceId = generateId('i', instanceIndex, region)
  const name = `instance-${region}-${instanceIndex}`

  return {
    mode: 'managed',
    type: 'aws_instance',
    name: `instance_${instanceIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 1,
        attributes: {
          ami: 'ami-0c55b159cbfafe1f0',
          instance_type: 't2.micro',
          arn: generateArn(region, accountId, 'ec2', 'instance', instanceId),
          id: instanceId,
          subnet_id: `subnet-${generateId('subnet', instanceIndex, region)}`,
          vpc_security_group_ids: [`sg-${generateId('sg', instanceIndex, region)}`],
          tags: {
            Name: name,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateLambdaFunction = (
  accountId: string,
  region: string,
  functionIndex: number
): TerraformResource => {
  const functionId = generateId('function', functionIndex, region)
  const name = `function-${region}-${functionIndex}`

  return {
    mode: 'managed',
    type: 'aws_lambda_function',
    name: `function_${functionIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 0,
        attributes: {
          arn: generateArn(region, accountId, 'lambda', 'function', functionId),
          id: functionId,
          function_name: name,
          handler: 'index.handler',
          role: generateArn(region, accountId, 'iam', 'role', `lambda-${functionId}`),
          runtime: 'nodejs18.x',
          filename: 'lambda.zip',
          source_code_hash: generateId('hash', functionIndex, region),
          timeout: 3,
          memory_size: 128,
          tags: {
            Name: name,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateSubnet = (
  accountId: string,
  region: string,
  subnetIndex: number,
  vpcId: string
): TerraformResource => {
  const subnetId = generateId('subnet', subnetIndex, region)
  const cidrBlock = `10.${Math.floor(subnetIndex / 16)}.${subnetIndex % 16}.0/24`

  return {
    mode: 'managed',
    type: 'aws_subnet',
    name: `subnet_${subnetIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 1,
        attributes: {
          arn: generateArn(region, accountId, 'ec2', 'subnet', subnetId),
          id: subnetId,
          vpc_id: vpcId,
          cidr_block: cidrBlock,
          availability_zone: `${region}a`,
          map_public_ip_on_launch: true,
          tags: {
            Name: `subnet-${region}-${subnetIndex}`,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateEBSVolume = (
  accountId: string,
  region: string,
  volumeIndex: number
): TerraformResource => {
  const volumeId = generateId('vol', volumeIndex, region)
  const name = `volume-${region}-${volumeIndex}`
  const size = 20 + (volumeIndex % 10) * 10 // Generates sizes from 20GB to 110GB

  return {
    mode: 'managed',
    type: 'aws_ebs_volume',
    name: `volume_${volumeIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 0,
        attributes: {
          arn: generateArn(region, accountId, 'ec2', 'volume', volumeId),
          id: volumeId,
          availability_zone: `${region}a`,
          encrypted: true,
          size: size,
          type: ['gp2', 'gp3', 'io1'][volumeIndex % 3],
          iops: volumeIndex % 3 === 2 ? 3000 + volumeIndex * 100 : null,
          tags: {
            Name: name,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateElastiCacheCluster = (
  accountId: string,
  region: string,
  clusterIndex: number
): TerraformResource => {
  const clusterId = generateId('cache', clusterIndex, region)
  const name = `cache-${region}-${clusterIndex}`
  const nodeType = ['cache.t3.micro', 'cache.t3.small', 'cache.t3.medium'][clusterIndex % 3]
  const numCacheNodes = 1 + (clusterIndex % 3)

  return {
    mode: 'managed',
    type: 'aws_elasticache_cluster',
    name: `cache_${clusterIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 0,
        attributes: {
          arn: generateArn(region, accountId, 'elasticache', 'cluster', clusterId),
          id: clusterId,
          cluster_id: name,
          engine: ['redis', 'memcached'][clusterIndex % 2],
          node_type: nodeType,
          num_cache_nodes: numCacheNodes,
          port: 6379,
          parameter_group_name: 'default.redis6.x',
          engine_version: '6.x',
          tags: {
            Name: name,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateRDSInstance = (
  accountId: string,
  region: string,
  instanceIndex: number
): TerraformResource => {
  const dbId = generateId('db', instanceIndex, region)
  const name = `db-${region}-${instanceIndex}`
  const instanceClass = [
    'db.t3.micro',
    'db.t3.small',
    'db.t3.medium',
    'db.t3.large',
  ][instanceIndex % 4]

  return {
    mode: 'managed',
    type: 'aws_db_instance',
    name: `db_${instanceIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 1,
        attributes: {
          arn: generateArn(region, accountId, 'rds', 'db', dbId),
          id: dbId,
          identifier: name,
          instance_class: instanceClass,
          allocated_storage: 20 + (instanceIndex % 5) * 10,
          engine: ['mysql', 'postgres', 'mariadb'][instanceIndex % 3],
          engine_version: ['8.0', '14.1', '10.5'][instanceIndex % 3],
          username: 'admin',
          port: [3306, 5432, 3306][instanceIndex % 3],
          publicly_accessible: false,
          skip_final_snapshot: true,
          tags: {
            Name: name,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateS3Bucket = (
  accountId: string,
  region: string,
  bucketIndex: number
): TerraformResource => {
  const bucketName = `bucket-${region}-${bucketIndex}-${generateId('', bucketIndex, region)}`

  return {
    mode: 'managed',
    type: 'aws_s3_bucket',
    name: `bucket_${bucketIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 0,
        attributes: {
          arn: generateArn(region, accountId, 's3', 'bucket', bucketName),
          id: bucketName,
          bucket: bucketName,
          force_destroy: true,
          versioning: {
            enabled: bucketIndex % 2 === 0,
          },
          tags: {
            Name: bucketName,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateDynamoDBTable = (
  accountId: string,
  region: string,
  tableIndex: number
): TerraformResource => {
  const tableId = generateId('table', tableIndex, region)
  const name = `table-${region}-${tableIndex}`

  return {
    mode: 'managed',
    type: 'aws_dynamodb_table',
    name: `table_${tableIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/aws"]',
    instances: [
      {
        schema_version: 1,
        attributes: {
          arn: generateArn(region, accountId, 'dynamodb', 'table', tableId),
          id: tableId,
          name: name,
          billing_mode: ['PROVISIONED', 'PAY_PER_REQUEST'][tableIndex % 2],
          read_capacity: tableIndex % 2 === 0 ? 5 + tableIndex : null,
          write_capacity: tableIndex % 2 === 0 ? 5 + tableIndex : null,
          hash_key: 'id',
          attribute: [
            {
              name: 'id',
              type: 'S',
            },
            {
              name: 'date',
              type: 'S',
            },
          ],
          ttl: {
            enabled: tableIndex % 2 === 0,
            attribute_name: 'ttl',
          },
          tags: {
            Name: name,
            Environment: 'production',
          },
        },
      },
    ],
  }
}

export const generateAWSStateFile = (
  regions: string[] = ['us-east-1'],
  selectedResources: CloudResource[],
  accountId: string = '123456789012'
): TerraformStateFile => {
  const resources: TerraformResource[] = []
  const vpcIds: Record<string, string> = {}

  // Process each resource with its assigned region
  selectedResources.forEach((resource, index) => {
    // Use the resource's assigned region or fall back to the first region
    const region = resource.region || regions[0]

    switch (resource.type) {
      case 'aws_vpc': {
        const vpc = generateVpc(accountId, region, index)
        vpcIds[region] = vpc.instances[0].attributes.id as string
        resources.push(vpc)
        break
      }
      case 'aws_instance':
        resources.push(generateEc2Instance(accountId, region, index))
        break
      case 'aws_lambda_function':
        resources.push(generateLambdaFunction(accountId, region, index))
        break
      case 'aws_subnet': {
        let vpcId = vpcIds[region]
        if (!vpcId) {
          const vpc = generateVpc(accountId, region, resources.length)
          vpcId = vpc.instances[0].attributes.id as string
          vpcIds[region] = vpcId
          resources.push(vpc)
        }
        resources.push(generateSubnet(accountId, region, index, vpcId))
        break
      }
      case 'aws_ebs_volume':
        resources.push(generateEBSVolume(accountId, region, index))
        break
      case 'aws_elasticache_cluster':
        resources.push(generateElastiCacheCluster(accountId, region, index))
        break
      case 'aws_db_instance':
        resources.push(generateRDSInstance(accountId, region, index))
        break
      case 'aws_s3_bucket':
        resources.push(generateS3Bucket(accountId, region, index))
        break
      case 'aws_dynamodb_table':
        resources.push(generateDynamoDBTable(accountId, region, index))
        break
    }
  })

  return {
    version: 4,
    terraform_version: '1.5.0',
    serial: 1,
    lineage: generateUUID(),
    outputs: {},
    resources,
  }
} 