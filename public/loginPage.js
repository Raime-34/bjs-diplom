'use strict'

const userForm = new UserForm();
userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (res) => {
        if (res.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(res.error);
        }
    });
}

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (res) => {
        if (res.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(res.error);
        }
    })
}