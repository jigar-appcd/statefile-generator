import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class CloudFrontFunctionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      runtime: 'cloudfront-js-1.0',
      comment: `CloudFront Function for ${resourceName}`,
      publish: true,
      code: `
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Normalize URI
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }
    
    return request;
}`,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 