const fs = require("fs");
const path = require("path");

const axios = require('axios');
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
        const html = handlebars.compile(template)({template: 'HBS'});

        // 3. Export the html to pdf
        const file = await exportHtmlToPdf(html);

        // 4. Upload file to S3

        response = responses.OK({message: "Ok"});
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