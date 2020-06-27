const fs = require("fs");
const path = require("path");
const AWS = require('aws-sdk');
const uuid = require('uuid');

const pdf = require('html-pdf');
const handlebars = require('handlebars');

const responses = require('./responses');

const templatePath = path.resolve(__dirname, "./template.hbs");
const template = fs.readFileSync(templatePath).toString();

process.env.PATH = `${process.env.PATH}:/opt`
process.env.FONTCONFIG_PATH = '/opt'
process.env.LD_LIBRARY_PATH = '/opt'

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    let response;
    try {
        // 1. Call to the external API.
        // const httpResponse = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${event.body.email}`, {
        //     headers: {"hibp-api-key": process.env.API_KEY}
        // });

        // 2. Compile the view with the context.
        // const html = handlebars.compile(template)({template: 'HBS'});

        // 3. Export the html to pdf
        // const file = await exportHtmlToPdf(html);

        // 4. Upload file to S3
        // const s3 = new AWS.S3();
        // const Key = `${uuid.v4()}.pdf`;
        // await s3.putObject({
        //     Bucket: process.env.BUCKET_NAME,
        //     Key,
        //     Body: file
        // }).promise();

        // const ses = new AWS.SES({region: process.env.SES_REGION});
        // const params = {
        //     Destination: {
        //         ToAddresses: [
        //             process.env.EMAIL_TO
        //         ]
        //     },
        //     Message: {
        //         Body: {
        //             Html: {
        //                 Charset: "UTF-8",
        //                 Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
        //             },
        //             Text: {
        //                 Charset: "UTF-8",
        //                 Data: "This is the message body in text format."
        //             }
        //         },
        //         Subject: {
        //             Charset: "UTF-8",
        //             Data: "Test email"
        //         }
        //     },
        //     Source: process.env.EMAIL_FROM,

        // }
        // await ses.sendEmail(params).promise()

        /**
         * - Send mail through SES
         * - Save into the database
         * - Design the report
         * - Get Presigned URL from CloudFront
         * 
         * Infrastructure
         * - Configure CloudFront distribution
         */


        response = responses.OK({message: "Ok"});
        return
    } catch (err) {
        response = responses.INTERNAL_SERVER_ERROR({message: err.message, trace: err.stack});
    } finally {
        console.log("response: " + JSON.stringify(response));
        return response;
    }
}

const exportHtmlToPdf = html => {
    return new Promise((resolve, reject) => {
        pdf.create(html, {
            format: "Letter",
            orientation: "portrait",
            phantomPath: '/opt/phantomjs_linux-x86_64',
            phantomArgs: []
        }).toBuffer((err, buffer) => {
            if (err) {
                reject(err)
            } else {
                resolve(buffer)
            }
        });
    })
}