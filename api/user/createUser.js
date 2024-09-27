// createUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const createUser = async (event) => {
  // Parse and validate input
  const body = JSON.parse(event.body);
  const { Name, Age, Email } = body;
  if (!Name || !Age || !Email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name, Age, and Email are required' }) };
  }

  // Create user in DynamoDB
  const userId = uuidv4();
  const params = {
    TableName: 'UserProfiles',
    Item: { UserId: userId, Name, Age: Number(Age), Email },
  };
  await dynamoDb.send(new PutCommand(params));

  // Return response
  return { statusCode: 201, body: JSON.stringify({ message: 'User created successfully', userId }) };
};
