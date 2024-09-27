// /api/user/getUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const getUser = async (event) => {
  const userId = event.pathParameters.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "UserId is required" }),
    };
  }

  const params = {
    TableName: 'UserProfiles',
    Key: {
      'UserId': userId,
    },
  };

  try {
    const data = await dynamoDb.send(new GetCommand(params));
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error("Error fetching user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching user" }),
    };
  }
};
