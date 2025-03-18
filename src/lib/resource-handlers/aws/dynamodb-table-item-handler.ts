import {
    ResourceAttributes,
    ResourceHandler,
    generateDynamoTableId
} from '../base-handler'

export class AWSDynamoDBTableItemHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const tableId = generateDynamoTableId()
    
    const attributes: ResourceAttributes = {
      table_name: `${resourceName}-${tableId}`,
      hash_key: {
        id: 'sample-id'
      },
      range_key: {
        timestamp: 1234567890
      },
      item: JSON.stringify({
        id: { S: 'sample-id' },
        timestamp: { N: '1234567890' },
        data: { S: 'Sample data for the item' },
        ttl: { N: '1893456000' }
      }),
      depends_on: [
        `aws_dynamodb_table.${tableId}`
      ]
    }

    return attributes
  }
} 