// deleteUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const deleteUser = async (event) => {
  const { userId } = event.pathParameters || {};
  
  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: "UserId is required" }) };
  }

  const params = { TableName: "UserProfiles", Key: { UserId: userId }, ReturnValues: "ALL_OLD" };
  const data = await dynamoDb.send(new DeleteCommand(params));
  
  return data.Attributes
    ? { statusCode: 200, body: JSON.stringify({ message: "User deleted successfully", user: data.Attributes }) }
    : { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
};
