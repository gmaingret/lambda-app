import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  let body;

  try {
    // Parser le corps de la requête
    body = JSON.parse(event.body);
  } catch (error) {
    console.error("Invalid JSON in request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  // Extraire les paramètres
  const { Name, Age, Email } = body;

  // Validation basique des données
  if (!Name || !Age || !Email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Name, Age, and Email are required" }),
    };
  }

  // Conversion de l'âge en nombre
  const ageNumber = Number(Age);
  if (isNaN(ageNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Age must be a number" }),
    };
  }

  const userId = uuidv4(); // Génère un identifiant unique
  const params = {
    TableName: 'UserProfiles',
    Item: {
      'UserId': userId,
      'Name': Name,
      'Age': ageNumber,
      'Email': Email
    }
  };

  try {
    const data = await dynamoDb.send(new PutCommand(params));
    console.log("User saved successfully:", data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Utilisateur enregistré avec succès", userId }),
    };
  } catch (err) {
    console.error("Error saving user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de l'enregistrement de l'utilisateur" }),
    };
  }
};
