// updateUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const updateUser = async (event) => {
  const { userId } = event.pathParameters || {};
  const { Name, Age, Email } = JSON.parse(event.body) || {};

  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: "UserId is required" }) };
  }

  if (!Name && !Age && !Email) {
    return { statusCode: 400, body: JSON.stringify({ error: "At least one of Name, Age, or Email must be provided" }) };
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
      return { statusCode: 400, body: JSON.stringify({ error: "Age must be a number" }) };
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

  const params = {
    TableName: "UserProfiles",
    Key: { UserId: userId },
    UpdateExpression: "SET " + updateExpressions.join(", "),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const data = await dynamoDb.send(new UpdateCommand(params));
  return { statusCode: 200, body: JSON.stringify({ message: "User updated successfully", user: data.Attributes }) };
};
