const fs = require("fs");
const path = require("path");
const AWS = require('aws-sdk');

const pdf = require('html-pdf');
const handlebars = require('handlebars');

const responses = require('./responses');

const templatePath = path.resolve(__dirname, "./template.hbs");
const template = fs.readFileSync(templatePath).toString();

process.env.PATH = `${process.env.PATH}:/opt`;
process.env.FONTCONFIG_PATH = '/opt';
process.env.LD_LIBRARY_PATH = '/opt';

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    let response;
    try {

        for (let index = 0; index < event.Records.length; index++) {
            const element = event.Records[index];

            // 1. Generate the compiled html
            const html = onGenerateHTML(element);

            // 2. Export the HTML file as PDF.
            const file = await onGeneratePDFFile(html);

            // 3. Upload file to S3 Bucket
            const Key = `${element.dynamodb.Keys.Id.S}.pdf`;
            await onUploadFileToS3(file, Key);

            // 4. Generate the signed url.
            const signedUrl = onGenerateSignedUrl(Key);

            // 5. Send it through mail
            await onSendEmail(signedUrl);

        }

        response = responses.OK({message: "Ok"});

    } catch (err) {
        response = responses.INTERNAL_SERVER_ERROR({message: err.message, trace: err.stack});
    } finally {
        console.log("response: " + JSON.stringify(response));
        return response;
    }
}

const onGenerateHTML = (element) => {
    // 1. Create the HTML template filling with the data.
    const html = handlebars.compile(template)({name: element.dynamodb.NewImage.Name.S, email: element.dynamodb.NewImage.Email.S, data: element.dynamodb.NewImage.Response.L});
    return html;
}

const onGenerateSignedUrl = (fileKey) => {

    const signer = new AWS.CloudFront.Signer(process.env.CF_ACCESS_KEY_ID, process.env.CF_PRIVATE_KEY);

    // 30 days as milliseconds to use for link expiration
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    // Generate the Signed Cloudfront URL
    const signedUrl = signer.getSignedUrl({
        url: `https://${process.env.CF_DOMAIN}/${fileKey}`,
        expires: Math.floor((Date.now() + thirtyDays) / 1000), // Unix UTC timestamp for now + 30 days
    });

    return signedUrl;
}

const onGeneratePDFFile = html => {
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

const onUploadFileToS3 = (file, key) => {
    const s3 = new AWS.S3();
    return s3.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file
    }).promise();
}

const onSendEmail = (signedUrl) => {
    const ses = new AWS.SES({region: process.env.SES_REGION});
    const params = {
        Destination: {
            ToAddresses: [
                process.env.EMAIL_TO
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `Please navigate to the following link to get more information: <a class=\"ulink\" href=\"${signedUrl}\" target=\"_blank\">Breached Email Account Report</a>.`
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Please navigate to the following link to get more information: ${signedUrl}.`
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Breached Email Account"
            }
        },
        Source: process.env.EMAIL_FROM,
    }
    return ses.sendEmail(params).promise();
}