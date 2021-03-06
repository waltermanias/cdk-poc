
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
}

const ACCEPTED = (data) => {
    return {
        statusCode: 202,
        headers,
        body: JSON.stringify(data)
    };
}

const INTERNAL_SERVER_ERROR = (data) => {
    return {
        statusCode: 500,
        headers,
        body: JSON.stringify(data)
    };
}

const BAD_REQUEST = (data) => {
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify(data)
    };
}

const NOT_FOUND = (data) => {
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify(data)
    };
}

module.exports = {
    ACCEPTED,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND
}
