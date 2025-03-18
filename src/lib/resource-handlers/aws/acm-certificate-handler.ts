import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ACMCertificateHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const validationRecordId = generateResourceId('validation')
    
    const attributes: ResourceAttributes = {
      domain_name: `${resourceName}.example.com`,
      validation_method: 'DNS',
      subject_alternative_names: [
        `*.${resourceName}.example.com`
      ],
      key_algorithm: 'RSA_2048',
      options: {
        certificate_transparency_logging_preference: 'ENABLED'
      },
      validation_option: [
        {
          domain_name: `${resourceName}.example.com`,
          validation_domain: `${resourceName}.example.com`
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      lifecycle: {
        create_before_destroy: true
      },
      depends_on: [
        `aws_route53_record.${validationRecordId}`
      ]
    }

    return attributes
  }
} 