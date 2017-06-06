flexipleTasks.authService = (function () {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.headers = options.header || {};
        options.headers.authorization = 'Bearer ' + flexipleTasks.authService.getToken();
    });
    
    function isAuthenticated() {
        return !!flexipleTasks.authService.getToken();
    }

    function getToken() {
        return localStorage.getItem('authToken');
    }

    function setToken( token ) {
        localStorage.setItem('authToken', token);
    }

    function removeToken() {
        localStorage.removeItem('authToken');
    }

    return {
        isAuthenticated: isAuthenticated,
        getToken: getToken,
        setToken: setToken,
        removeToken: removeToken
    };
}());