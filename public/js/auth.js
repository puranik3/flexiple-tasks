flexipleTasks.authService = (function () {
    flexipleTasks.email = null;

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

    function setToken( token, email ) {
        localStorage.setItem('authToken', token);
        flexipleTasks.email = email;
    }

    function removeToken() {
        localStorage.removeItem('authToken');
        flexipleTasks.email = null;
    }

    function getEmail() {
        return flexipleTasks.email;
    }

    return {
        isAuthenticated: isAuthenticated,
        getToken: getToken,
        setToken: setToken,
        removeToken: removeToken,
        getEmail: getEmail
    };
}());