import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateBeanstalkAppId,
    generateS3BucketId
} from '../base-handler'

export class AWSElasticBeanstalkApplicationVersionHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const appId = generateBeanstalkAppId()
    const bucketId = generateS3BucketId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      application: appId,
      description: 'Application version created by Terraform',
      bucket: bucketId,
      key: 'app-package.zip',
      force_delete: true,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_elastic_beanstalk_application.${appId}`,
        `aws_s3_bucket.${bucketId}`
      ]
    }

    return attributes
  }
} 