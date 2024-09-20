import { v4 as uuidv4 } from 'uuid'; // Utilisez `npm install uuid` pour installer ce module
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Créer un client DynamoDB
const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

// Générer un UserId unique
const userId = uuidv4(); // Génère un identifiant unique

// Définir les paramètres de l'élément à enregistrer
const params = {
  TableName: 'UserProfiles',
  Item: {
    'UserId': userId, // Utiliser UserId comme clé de partition
    'Name': 'John Doe', // Enregistrer le nom de l'utilisateur
    'Age': 30,          // Exemple d'attribut supplémentaire
    'Email': 'johndoe@example.com' // Exemple d'attribut supplémentaire
  }
};

try {
  // Exécuter la commande Put pour enregistrer l'utilisateur
  const data = await dynamoDb.send(new PutCommand(params));
  console.log("User saved successfully:", data);
} catch (err) {
  console.error("Error saving user:", err);
}
