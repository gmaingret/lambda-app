import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // Journaliser l'événement reçu

  const userId = uuidv4();
  const params = {
    TableName: 'UserProfiles',
    Item: {
      'UserId': userId,
      'Name': event.Name, // Récupère les valeurs de la requête
      'Age': event.Age,
      'Email': event.Email
    }
  };

  try {
    const data = await dynamoDb.send(new PutCommand(params));
    console.log("User saved successfully:", data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User saved successfully!',
        data: params.Item
      }),
    };
  } catch (err) {
    console.error("Error saving user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error saving user.',
        error: err.message,
      }),
    };
  }
};
