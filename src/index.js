import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {seedTypes, createDefaultUser} from "./store/seeders"
import * as DB from "./store/database"

//INIT LOCAL DB CREATE TABLES AND Fill it

(async function () {
    await DB.createDatabase();
    await DB.createTables();
    await seedTypes();
    await createDefaultUser();
    await DB.getCurrentUser();
})();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
