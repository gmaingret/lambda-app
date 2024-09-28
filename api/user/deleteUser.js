// deleteUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: "eu-west-3" });
const bucketName = '100110721009-user-profile-pictures'; 

export const deleteUser = async (event) => {
  const { userId } = event.pathParameters || {};
  
  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: "UserId is required" }) };
  }

  const params = { TableName: "UserProfiles", Key: { UserId: userId }, ReturnValues: "ALL_OLD" };
  const data = await dynamoDb.send(new DeleteCommand(params));
  
 // Delete profile picture if it exists
 if (data.Attributes?.ProfilePicture) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: `${userId}.jpg` }));
}

// Return response based on whether user was found or not
return data.Attributes
  ? { statusCode: 200, body: JSON.stringify({ message: "User deleted successfully", user: data.Attributes }) }
  : { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
};