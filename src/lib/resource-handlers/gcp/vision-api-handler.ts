import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPVisionAPIHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: '${data.google_project.current.project_id}',
      location: region.code,
      product_set: {
        display_name: `${resourceName}-product-set`,
        index_time: '2023-01-01T00:00:00.000Z',
        index_error: null
      },
      product: {
        display_name: `${resourceName}-product`,
        description: 'Vision API product',
        product_category: 'general-v1',
        product_labels: [
          {
            key: 'category',
            value: 'electronics'
          }
        ]
      },
      reference_image: {
        uri: '${google_storage_bucket.vision_images.url}/reference.jpg',
        bounding_polys: [
          {
            normalized_vertices: [
              {
                x: 0.1,
                y: 0.1
              },
              {
                x: 0.9,
                y: 0.9
              }
            ]
          }
        ]
      },
      annotation: {
        description: 'Product annotation',
        language_hints: ['en'],
        features: [
          'FACE_DETECTION',
          'LANDMARK_DETECTION',
          'LOGO_DETECTION',
          'LABEL_DETECTION',
          'TEXT_DETECTION',
          'DOCUMENT_TEXT_DETECTION',
          'SAFE_SEARCH_DETECTION',
          'IMAGE_PROPERTIES',
          'CROP_HINTS',
          'WEB_DETECTION',
          'OBJECT_LOCALIZATION'
        ],
        max_results: 50,
        model: 'builtin/stable',
        async: true
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 