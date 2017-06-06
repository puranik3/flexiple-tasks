(function () {
    var actions = $('#actions');
    
    var btnViewTasks = $( '#btnViewTasks' );
    var btnAddTask = $('#btnAddTask');
    var btnLogout = $('#btnLogout');

    var btnFrmLoginReset = $( '#btn-frm-login-reset');
    var btnFrmLoginSubmit = $('#btn-frm-login-submit');

    var btnFrmAddTaskReset = $('#btn-frm-add-task-reset');
    var btnFrmAddTaskSubmit = $('#btn-frm-add-task-submit');

    var mainViewBody = $('#main-view-body');

    var loginTplEl = $('#login-template');
    var loginTpl = _.template(loginTplEl.html());

    var tasksTplEl = $('#tasks-template');
    var tasksTpl = _.template(tasksTplEl.html());

    var addTaskTplEl = $('#add-task-template');
    var addTaskTpl = _.template(addTaskTplEl.html());
    
    function renderView( viewId ) {
        if (!flexipleTasks.authService.isAuthenticated()) {
            viewId = 'login';
        }

        renderActions(viewId === 'login');
        switch (viewId) {
            case 'login':
                renderLogin();
                break;
            case 'view-tasks':
                renderViewTasks();
                break;
            case 'add-task':
                renderAddTask();
                break;
            default:
                renderViewTasks();
        }
    }

    function renderViewTitle(title) {
        $('#main-view-name').html(title);
    }

    function renderLogin() {
        renderViewTitle('Login');
        mainViewBody.html(loginTpl());
        bindLoginEvents();
    }

    function frmLoginSubmitEventHandler($event) {
        var frmLogin = $('#frm-login');

        $.ajax({
            url: '/login',
            method: 'post',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                "email": $('#login-email').val(),
                "password": $( '#login-password' ).val()
            }),
            success: function (response) {
                flexipleTasks.authService.setToken(response.authToken);
                renderView('view-tasks');
            },
            error: function(err) {
                alert('Unable to login - Incorrect email id or password.');
            }
        });

        $event.preventDefault();
    }
    
    function bindLoginEvents() {
        var frmLogin = $('#frm-login');
        frmLogin.off('submit');
        frmLogin.on('submit', frmLoginSubmitEventHandler );
    }

    function renderActions(isHide) {
        if (isHide) {
            actions.hide();
        } else {
            actions.show();
            bindActionsEvents();
        }
    }

    function bindActionsEvents() {
        btnViewTasks.on('click', function () {
            renderViewTasks();
        });

        btnAddTask.on('click', function () {
            renderAddTask();
        });

        btnLogout.on('click', function () {
            flexipleTasks.authService.removeToken();
            renderView('login');
        });
    }

    function renderViewTasks() {
        renderViewTitle('Tasks');
        $.ajax({
            url: '/tasks',
            success: function (response) {
                mainViewBody.html(tasksTpl({
                    tasks: response
                }));
            },
            error: function (err) {
                console.log(arguments);
                alert('Some error occured fetching tasks [' + err.statusText + ']');
                renderView('login');
            }
        });
    }

    function renderAddTask() {
        renderViewTitle('Add a task');
        mainViewBody.html( addTaskTpl() );
        bindAddTaskEvents();
    }

    function frmAddTaskSubmitEventHandler($event) {
        var frmAddTask = $('#frm-add-task');

        $.ajax({
            url: '/tasks',
            method: 'post',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                title: $('#title').val(),
                deadline: $( '#deadline' ).val(),
                description: $( '#description' ).val(),
                type: $( '#type' ).val()
            }),
            success: function (response) {
                renderViewTasks();
            },
            error: function() {
                alert('Some error occured adding task.');
            }
        });

        $event.preventDefault();
    }
    
    function bindAddTaskEvents() {
        var frmAddTask = $('#frm-add-task');
        frmAddTask.off('submit');
        frmAddTask.on('submit', frmAddTaskSubmitEventHandler );
    }

    renderView( 'view-tasks' );
}());