// /api/user/updateUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const updateUser = async (event) => {
  const userId = event.pathParameters.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "UserId is required" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    console.error("Invalid JSON in request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  const { Name, Age, Email } = body;

  if (!Name && !Age && !Email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "At least one of Name, Age, or Email must be provided",
      }),
    };
  }

  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  if (Name) {
    updateExpressions.push("#name = :name");
    expressionAttributeNames["#name"] = "Name";
    expressionAttributeValues[":name"] = Name;
  }

  if (Age) {
    const ageNumber = Number(Age);
    if (isNaN(ageNumber)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Age must be a number" }),
      };
    }
    updateExpressions.push("#age = :age");
    expressionAttributeNames["#age"] = "Age";
    expressionAttributeValues[":age"] = ageNumber;
  }

  if (Email) {
    updateExpressions.push("#email = :email");
    expressionAttributeNames["#email"] = "Email";
    expressionAttributeValues[":email"] = Email;
  }

  const updateExpression = "SET " + updateExpressions.join(", ");

  const params = {
    TableName: "UserProfiles",
    Key: {
      UserId: userId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await dynamoDb.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User updated successfully",
        user: data.Attributes,
      }),
    };
  } catch (err) {
    console.error("Error updating user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error updating user" }),
    };
  }
};
