import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "your-region" });
const dynamoDb = DynamoDBDocumentClient.from(client);

const params = {
  TableName: 'YourTableName',
  Key: {
    'id': '123'
  }
};

try {
  const data = await dynamoDb.send(new GetCommand(params));
  console.log(data);
} catch (err) {
  console.error(err);
}
