const fs = require("fs");
const path = require("path");
const AWS = require('aws-sdk');
const axios = require('axios');
const uuid = require('uuid');
const timestamp = require('time-stamp');

const responses = require('./responses');

// const JSONSamplePath = path.resolve(__dirname, "./sample.json");
// const SampleJSON = fs.readFileSync(JSONSamplePath).toString();

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

        const params = {
            TableName: process.env.TABLE_NAME, Item: {
                Id: {S: uuid.v4()},
                Response: {
                    L: [{
                        M: {
                            "Name": {S: "2844Breaches"},
                            "Age": {S: "2,844 Separate Data Breaches"},
                            "Domain": {S: ""},
                            "BreachDate": {S: "2018-02-19"},
                            "AddedDate": {S: "2018-02-26T10:06:02Z"},
                            "ModifiedDate": {S: "2018-02-26T10:06:02Z"},
                            "PwnCount": {N: String(80115532)},
                            "Description": {S: "My description"},
                            "LogoPath": {S: "https://haveibeenpwned.com/Content/Images/PwnedLogos/List.png"},
                            "DataClasses": {SS: ["Email addresses", "Passwords"]},
                            "IsVerified": {BOOL: false},
                            "IsFabricated": {BOOL: false},
                            "IsSensitive": {BOOL: false},
                            "IsRetired": {BOOL: false},
                            "IsSpamList": {BOOL: false},
                        }
                    },
                    {
                        M: {
                            "Name": {S: "2844Breaches2222"},
                            "Age": {S: "2,844 Separate Data Breaches"},
                            "Domain": {S: ""},
                            "BreachDate": {S: "2018-02-19"},
                            "AddedDate": {S: "2018-02-26T10:06:02Z"},
                            "ModifiedDate": {S: "2018-02-26T10:06:02Z"},
                            "PwnCount": {N: String(80115532)},
                            "Description": {S: "My description"},
                            "LogoPath": {S: "https://haveibeenpwned.com/Content/Images/PwnedLogos/List.png"},
                            "DataClasses": {SS: ["Email addresses", "Passwords"]},
                            "IsVerified": {BOOL: false},
                            "IsFabricated": {BOOL: false},
                            "IsSensitive": {BOOL: false},
                            "IsRetired": {BOOL: false},
                            "IsSpamList": {BOOL: false},
                        }
                    }
                    ]
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
