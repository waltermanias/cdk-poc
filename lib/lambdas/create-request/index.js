const fs = require("fs");
const path = require("path");
const AWS = require('aws-sdk');
const axios = require('axios');
const uuid = require('uuid');
const timestamp = require('time-stamp');

const responses = require('./responses');

// const JSONSamplePath = path.resolve(__dirname, "./sample.json");
// const SampleJSON = fs.readFileSync(JSONSamplePath).toString();

verifyNull = (item, property) => {
    if (item[property])
        return {S: item[property]}
    return {NULL: true}
}

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    let response;
    try {
        // 1. Call to the external API.
        const httpResponse = await axios.get(`${process.env.API_ENDPOINT}/${event.body.email}`, {
            headers: {"hibp-api-key": process.env.API_KEY}
        });

        // 1. Mock
        // const httpResponse = {data: SampleJSON}

        const ddb = new AWS.DynamoDB();

        const mappedResponse = httpResponse.data.map(item => {
            return {
                M: {
                    Name: verifyNull(item, 'Name'),
                    Title: verifyNull(item, 'Title'),
                    Domain: verifyNull(item, 'Domain'),
                    BreachDate: verifyNull(item, 'BreachDate'),
                    AddedDate: verifyNull(item, 'AddedDate'),
                    ModifiedDate: verifyNull(item, 'ModifiedDate'),
                    PwnCount: {N: String(item.PwnCount)},
                    Description: verifyNull(item, 'Description'),
                    LogoPath: verifyNull(item, 'LogoPath'),
                    DataClasses: {SS: item.DataClasses || []},
                    IsVerified: {BOOL: item.IsVerified},
                    IsFabricated: {BOOL: item.IsFabricated},
                    IsSensitive: {BOOL: item.IsSensitive},
                    IsRetired: {BOOL: item.IsRetired},
                    IsSpamList: {BOOL: item.IsSpamList},
                }
            }
        })

        const params = {
            TableName: process.env.TABLE_NAME, Item: {
                Id: {S: uuid.v4()},
                Response: {
                    L: mappedResponse
                },
                Timestamp: {N: Number(timestamp.utc('YYYYMMDDHHmmssms')).toString()}
            }
        }

        await ddb.putItem(params).promise()

        response = responses.OK({message: "Ok"});

    } catch (err) {
        response = responses.INTERNAL_SERVER_ERROR({message: err.message, trace: err.stack});
    } finally {
        console.log("response: " + JSON.stringify(response));
        return response;
    }


}


