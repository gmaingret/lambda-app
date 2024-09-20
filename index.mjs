import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

const params = {
  TableName: 'UserProfiles',
  Key: {
            'UserId': '123', // Example user ID
            'Name': 'John Doe'
  }
};

try {
  const data = await dynamoDb.send(new GetCommand(params));
  console.log(data);
} catch (err) {
  console.error(err);
}
