import * as alasql from 'alasql';


function getJWT() {
    return window.localStorage.getItem('JWT');
}

function setJWT(value) {
    window.localStorage.setItem('JWT', value);
}

function remoteJWT() {
    window.localStorage.removeItem("JWT");
}

function getCurrentUser()
{
    return parseInt( window.localStorage.getItem('currentUser') );
}

function setCurrentUser(value)
{
    window.localStorage.setItem('currentUser', value);
}

const createDatabase = () =>
{
    alasql(`
    CREATE LOCALSTORAGE DATABASE IF NOT EXISTS db;
    ATTACH LOCALSTORAGE DATABASE db;
    USE db;
    `);
}

const  createTables = async () =>
{
    try {

        await alasql(`CREATE TABLE IF NOT EXISTS Users(id INT PRIMARY KEY, username STRING, UNIQUE(id));`)
        
        await alasql(`CREATE TABLE IF NOT EXISTS Types(id INT AUTOINCREMENT PRIMARY KEY, name STRING, user_id INT REFERENCES Users(id));`);
        
        await alasql(`CREATE TABLE IF NOT EXISTS Expenses(id INT AUTOINCREMENT PRIMARY KEY, name STRING, amount INT, date DATETIME, typeid INT REFERENCES Types(id), user_id INT REFERENCES Users(id));`)
        
        await alasql(`CREATE TABLE IF NOT EXISTS Limit(id INT AUTOINCREMENT PRIMARY KEY, amount INT, date DATETIME, user_id INT REFERENCES Users(id) );`)
        
    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}

const deleteUserData = async (userId) => {
    try {
        await alasql(`DELETE FROM Users WHERE id = ?`, [userId]) ;
        
        await alasql(`DELETE FROM Expenses WHERE user_id = ?`, [userId]);
        await alasql(`DELETE FROM Limit WHERE user_id = ?`, [userId]);

    } catch (e) {
        console.error(`Error occured: ${e}`)
    }
}

const persistData = async (data, userId) => {
    try {
        await deleteUserData(userId);
        await alasql(`INSERT INTO Users VALUES ?`, [{ username:data.user.name, id:userId }]);
        
        await data.expenses.map(expense => {
            alasql(`INSERT INTO Expenses VALUES ?`, [expense]);
        });

        await alasql(`INSERT INTO Limit VALUES ?`, [{amount: data.limit.value, user_id: userId }]);
        await  window.localStorage.setItem("logged", true);

    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}

const insertData = async (table,payload) =>
{
    try {
        switch (table) {
            case "expenses":
                alasql(`INSERT INTO Expenses VALUES ?`, [payload]);
            break;

            case "types":
                alasql(`INSERT INTO Types VALUES ?`, [payload]);
            break;

            case "limit":
                alasql(`INSERT INTO Limit VALUES ?`, [payload]);
            break;
            
            case "users":
                alasql(`INSERT INTO Users VALUES ?`, [payload]);
            break;
        }
    } catch (e) {
        console.error(`Error occured: ${e}`);
    }
}

const getData = (id, table) =>
{
    switch (table) {
        case "expenses":
           return alasql(`SELECT * FROM Expenses WHERE user_id = ?`, [id]);

        case "types":
           return alasql(`SELECT * FROM Types WHERE id = ?`, [id])[0];

        case "limit":
           return alasql(`SELECT * FROM Limit WHERE user_id = ?`, [id])[0];
           
        case "users":
            return alasql(`SELECT * FROM Users WHERE id = ?`, [id])[0];
            
        default:
            return
    }

}

const getExpensesByType = (typeId, userId) => {
    if (isNaN(typeId)) return getDatas("expenses", userId);
    return alasql(`SELECT * FROM Expenses WHERE typeid = ? AND user_id = ?`, [typeId, userId])
    .map(expense => ({...expense, typeid:typeId})  );
}

const getDatas = (table, userId = 0) => {
    switch (table) {
        case "expenses":
           return alasql(`SELECT * FROM Expenses WHERE user_id = ?`, [userId]);

        case "types":
           return alasql(`SELECT * FROM Types`);

        case "limit":
           return alasql(`SELECT * FROM Limit WHERE user_id = ?`, [userId]);
    }
}

const getByDate = (table, start, end, userId) => {
    return (alasql(`SELECT * from Expenses WHERE date BETWEEN ? AND ? AND user_id = ?`, [start, end, userId]));
}

const updateData = (id, table, payload) =>
{
    switch (table) {
        case "expenses":
            alasql(`UPDATE FROM Expenses SET ? WHERE user_id = ?`, [payload, id]);
        break;

        case "types":
            alasql(`UPDATE FROM Types SET ? WHERE user_id = ?`, [payload, id]);
        break;

        case "limit":
            alasql(`UPDATE Limit SET amount = ? WHERE user_id = ?`, [payload, id]);
        break;
    }

}

const deleteData = (id, table, userId) =>
{
    switch (table) {
        case "expenses":
            alasql(`DELETE FROM Expenses WHERE id = ? AND user_id = ? `, [id, userId]);
        break;

        case "types":
            alasql(`DELETE FROM Types WHERE id = ? `, [id]);
        break;

        case "limit":
            alasql(`DELETE FROM Limit WHERE id = ? AND user_id = ? `, [id, userId]);
        break;
    }

}

export {
    createDatabase,
    createTables,
    insertData,
    getData,
    getDatas,
    updateData,
    deleteData,
    getExpensesByType,
    getByDate,
    persistData,
    getCurrentUser,
    setCurrentUser,
    getJWT, 
    setJWT,
    remoteJWT,
    deleteUserData
}