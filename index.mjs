import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    const params = {
        TableName: 'UserProfiles',
        Item: {
            'UserId': '123', // Example user ID
            'Name': 'John Doe'
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify('User profile saved successfully!'),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error saving user profile: ${error.message}`,
        };
    }
};
