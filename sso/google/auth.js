import { OAuth2Client } from 'google-auth-library';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);
const oAuth2Client = new OAuth2Client("252635174251-jdhq4n0m2qrfbglobb1c4p00cgss0aln.apps.googleusercontent.com");

export const handler = async (event) => {
  const { token } = JSON.parse(event.body);

  try {
    // Verify the ID token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: "252635174251-jdhq4n0m2qrfbglobb1c4p00cgss0aln.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // Check if the user already exists in DynamoDB
    const getUser = await dynamoDb.get({
      TableName: 'UserProfiles',
      Key: { UserId: sub }
    }).promise();

    if (!getUser.Item) {
      // Create a new user if they don't exist
      await dynamoDb.put({
        TableName: 'UserProfiles',
        Item: {
          UserId: sub,
          Email: email,
          Name: name
        }
      }).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User logged in successfully', user: getUser.Item || { UserId: sub, Email: email, Name: name } })
    };
  } catch (error) {
    console.error('Error verifying ID token or processing user:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid token or user processing failed' })
    };
  }
};
