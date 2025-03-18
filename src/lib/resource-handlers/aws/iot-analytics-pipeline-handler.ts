import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class IoTAnalyticsPipelineHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      pipeline_activities: [
        {
          channel: {
            name: 'ingest_data',
            channel_name: '${aws_iotanalytics_channel.input.name}',
            next: 'filter_data'
          }
        },
        {
          filter: {
            name: 'filter_data',
            filter: 'temperature > 30',
            next: 'transform_data'
          }
        },
        {
          datastore: {
            name: 'store_raw_data',
            datastore_name: '${aws_iotanalytics_datastore.raw.name}'
          }
        },
        {
          lambda: {
            name: 'transform_data',
            lambda_name: '${aws_lambda_function.transform.function_name}',
            batch_size: 100,
            next: 'enrich_data'
          }
        },
        {
          add_attributes: {
            name: 'enrich_data',
            attributes: {
              ProcessedTimestamp: '$$timestamp',
              Region: region.code
            },
            next: 'store_processed_data'
          }
        },
        {
          datastore: {
            name: 'store_processed_data',
            datastore_name: '${aws_iotanalytics_datastore.processed.name}'
          }
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_iotanalytics_channel.input',
        'aws_iotanalytics_datastore.raw',
        'aws_lambda_function.transform',
        'aws_iotanalytics_datastore.processed'
      ]
    }

    return attributes
  }
} 