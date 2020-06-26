const responses = require('./responses');

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    const response = responses.OK({message: "Ok"})

    console.log("response: " + JSON.stringify(response));
    return response;
}