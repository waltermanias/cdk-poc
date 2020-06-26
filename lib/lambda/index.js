exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({message: "Ok"})
    };
    console.log("response: " + JSON.stringify(response));
    return response;
}