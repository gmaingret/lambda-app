// createUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const createUser = async (event) => {
  const { Name, Age, Email } = JSON.parse(event.body) || {};

  if (!Name || !Age || !Email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name, Age, and Email are required' }) };
  }

  const params = {
    TableName: 'UserProfiles',
    Item: { UserId: uuidv4(), Name, Age: Number(Age), Email },
  };
  
  await dynamoDb.send(new PutCommand(params));
  return { statusCode: 201, body: JSON.stringify({ message: 'User created successfully', userId: params.Item.UserId }) };
};