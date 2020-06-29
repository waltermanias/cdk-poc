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

        const s3 = new AWS.S3();

        for (let index = 0; index < event.Records.length; index++) {
            const element = event.Records[index];

            const html = handlebars.compile(template)({name: element.dynamodb.NewImage.Name.S, email: element.dynamodb.NewImage.Email.S, data: element.dynamodb.NewImage.Response.L});

            //fs.writeFileSync('test.html', html)

            // 3. Export the html to pdf
            const file = await exportHtmlToPdf(html);

            //  fs.writeFile( 'test1.pdf', file, err => {
            //      console.error(err)
            //  } )

            //4. Upload file to S3
            const Key = `${element.dynamodb.Keys.Id.S}.pdf`;
            await s3.putObject({
                Bucket: process.env.BUCKET_NAME,
                Key,
                Body: file
            }).promise();

            // 5. Send mail

        }



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
            orientation: "landscape",
            header: {
                height: '20px'
            },
            footer: {
                height: '30px',
            },
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