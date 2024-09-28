console.log("START LOGGING!")

// Consolidated index.mjs

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Handler ------');
  console.log('Event received by Lambda:', JSON.stringify(event, null, 2));
  console.log('Handler invoked');

  const httpMethod = event.requestContext.http.method;
  const path = event.requestContext.http.path;
  
  console.log(`HTTP Method: ${httpMethod}, Path: ${path}`);
  try {
    if (httpMethod === 'POST' && path === '/user') {
      console.log('Creating user...');
      return await createUser(event);
    } else if (httpMethod === 'GET' && path.startsWith('/user/')) {
      console.log('Getting user...');
      return await getUser(event);
    } else if (httpMethod === 'PUT' && path.startsWith('/user/')) {
      console.log('Updating user...');
      return await updateUser(event);
    } else if (httpMethod === 'DELETE' && path.startsWith('/user/')) {
      console.log('Deleting user...');
      return await deleteUser(event);
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' }),
      };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// CRUD Operations combined here:

// Create User
const createUser = async (event) => {
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

  if (!Name || !Age || !Email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name, Age, and Email are required' }),
    };
  }

  try {
    const userId = uuidv4();
    const params = {
      TableName: 'UserProfiles',
      Item: { UserId: userId, Name, Age: Number(Age), Email },
    };
    await dynamoDb.send(new PutCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully', userId }),
    };
  } catch (err) {
    console.error("Error saving user to DynamoDB:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error saving user" }),
    };
  }
};

// Get User
const getUser = async (event) => {
  const userId = event.pathParameters.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "UserId is required" }),
    };
  }

  const params = {
    TableName: 'UserProfiles',
    Key: { UserId: userId },
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

// Update User
const updateUser = async (event) => {
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
    Key: { UserId: userId },
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

// Delete User
const deleteUser = async (event) => {
  const userId = event.pathParameters.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "UserId is required" }),
    };
  }

  const params = {
    TableName: "UserProfiles",
    Key: { UserId: userId },
    ReturnValues: "ALL_OLD",
  };

  try {
    const data = await dynamoDb.send(new DeleteCommand(params));
    if (!data.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User deleted successfully",
        user: data.Attributes,
      }),
    };
  } catch (err) {
    console.error("Error deleting user:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error deleting user" }),
    };
  }
};
