const OK = (data) => {
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}

const INTERNAL_SERVER_ERROR = (data) => {
    return {
        statusCode: 500,
        body: JSON.stringify(data)
    };
}

module.exports = {
    OK,
    INTERNAL_SERVER_ERROR
}
