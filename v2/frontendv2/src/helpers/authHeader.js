export function authHeader() {
    // return authorization header with jwt token
    let userToken = localStorage.getItem('UrgentAppAPI');

    var config = {
        headers: {
            'Authorization': 'Bearer ' + userToken
        }
    };

    if (userToken !== "null") {
        return config;
    } else {
        return {};
    }
}