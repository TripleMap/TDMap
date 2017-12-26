export class Promises {
    getPromise(url, params, headers) {
        var request = {
            url: url,
            type: 'GET',
        };

        if (params !== null && params !== undefined) {
            request.params = params;
        }

        if (headers !== null && headers !== undefined) {
            request.headers = headers;
        }
        return $.get(request);
    }
};