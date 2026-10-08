'use strict'

// logout
const logoutBtn = new LogoutButton()
logoutBtn.action = () => { ApiConnector.logout(
    (res) => {
        if (res.success) {
            location.reload();
        }
    }
) }

let currentUser = null;
const user = ApiConnector.current((res) => {
    if (res.success) {
        currentUser = res.data;
        ProfileWidget.showProfile(currentUser);
    }
})

// Таблица курсов валют
const rBoard = new RatesBoard()
function showCurrentRates() {
    ApiConnector.getStocks((res) => {
        console.log('[showCurrentRates] tick');
        if (res.success) {
            rBoard.clearTable();
            rBoard.fillTable(res.data);
        }
    })
}
showCurrentRates();
setInterval(() => {
    showCurrentRates();
}, 60000);

// Операции с деньгами
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
    console.log(`[addMoneyCallback]: data = ${JSON.stringify(data)}`);
    ApiConnector.addMoney(data, (res) => {
        console.log(`[addMoney]: res: ${JSON.stringify(res)}`);
        if (res.success) {
            ProfileWidget.showProfile(res.data);
            moneyManager.setMessage(res.success, `Баланс пополнен`);
        } else {
            moneyManager.setMessage(res.success, res.error);
        }
    });
}

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (res) => {
        if (res.success) {
            ProfileWidget.showProfile(res.data);
            moneyManager.setMessage(res.success, `Валюта конвертирована`);
        } else {
            moneyManager.setMessage(res.success, res.error);
        }
    })
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (res) => {
        if (res.success) {
            ProfileWidget.showProfile(res.data);
            moneyManager.setMessage(res.success, `Деньги переведены`);
        } else {
            moneyManager.setMessage(res.success, res.error);
        }
    })
}

const favWidget = new FavoritesWidget();
ApiConnector.getFavorites((res) => {
    if (res.success) {
        favWidget.clearTable();
        favWidget.fillTable(res.data);
        moneyManager.updateUsersList(res.data);
    }
})

favWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (res) => {
        if (res.success) {
            favWidget.clearTable();
            favWidget.fillTable(res.data);
            moneyManager.updateUsersList(res.data);
            favWidget.setMessage(res.success, `Пользователь добавлен в избранное`);
        } else {
            favWidget.setMessage(res.success, res.error);
        }
    })
}

favWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, (res) => {
        if (res.success) {
            favWidget.clearTable();
            favWidget.fillTable(res.data);
            moneyManager.updateUsersList(res.data);
            favWidget.setMessage(res.success, `Пользователь удалён из избранного`);
        } else {
            favWidget.setMessage(res.success, res.error);
        }
    })
}