import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Créer un client DynamoDB
const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

// Définir les paramètres de l'élément que vous voulez enregistrer
const params = {
  TableName: 'UserProfiles', // Nom de la table
  Item: {
    'Name': 'John Doe', // Utilisez le nom comme clé primaire si c'est configuré comme tel
    'Age': 30,          // Ajoutez d'autres attributs selon votre besoin
    'Email': 'johndoe@example.com' // Un exemple d'attribut supplémentaire
  }
};

try {
  // Exécuter la commande Put pour enregistrer l'élément
  const data = await dynamoDb.send(new PutCommand(params));
  console.log("User saved successfully:", data);
} catch (err) {
  console.error("Error saving user:", err);
}
