// createUser.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "eu-west-3" });
const dynamoDb = DynamoDBDocumentClient.from(client);
const s3 = new S3Client({ region: "eu-west-3"});
const bucketName = '100110721009-user-profile-pictures'; 

export const createUser = async (event) => {
  const { Name, Age, Email, ProfilePicture } = JSON.parse(event.body) || {};

  if (!Name || !Age || !Email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name, Age, and Email are required' }) };
  }

  const userId = uuidv4();
  const pictureUrl = ProfilePicture ? await uploadProfilePicture(userId, ProfilePicture) : null;

  const params = {
    TableName: 'UserProfiles',
    Item: { UserId: userId, Name, Age: Number(Age), Email, ProfilePicture: pictureUrl },
  };
  
  await dynamoDb.send(new PutCommand(params));
  return { statusCode: 201, body: JSON.stringify({ message: 'User created successfully', userId: params.Item.UserId }) };
};

const uploadProfilePicture = async (userId, base64Image) => {
  const buffer = Buffer.from(base64Image, 'base64');
  const uploadParams = {
    Bucket: bucketName,
    Key: `${userId}.jpg`, // Store as a jpg file
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  };
  await s3.send(new PutObjectCommand(uploadParams));
  return `https://${bucketName}.s3.amazonaws.com/${userId}.jpg`;
};