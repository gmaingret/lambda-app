import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const userId = uuidv4(); // Génère un identifiant unique
  const params = {
    TableName: 'UserProfiles',
    Item: {
      'UserId': userId, // Utilise l'ID généré comme clé primaire
      'Name': 'John Doe',
      'Age': 30,
      'Email': 'johndoe@example.com'
    }
  };

  try {
    const data = await dynamoDb.send(new PutCommand(params));
    console.log("User saved successfully:", data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Utilisateur enregistré avec succès", data }),
    };
  } catch (err) {
    console.error("Error saving user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de l'enregistrement de l'utilisateur", details: err.message }),
    };
  }
};
