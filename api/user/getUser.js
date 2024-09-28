// getUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const getUser = async (event) => {
  const { userId } = event.pathParameters || {};

  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: "UserId is required" }) };
  }

  const data = await dynamoDb.send(new GetCommand({ TableName: 'UserProfiles', Key: { 'UserId': userId } }));
  
  return data.Item
    ? { statusCode: 200, body: JSON.stringify(data.Item) }
    : { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
};
