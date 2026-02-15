import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOLttkuYPABUsY8GsppcHZYHWQSHumkc0",
    authDomain: "valdoria-online.firebaseapp.com",
    databaseURL: "https://valdoria-online-default-rtdb.firebaseio.com",
    projectId: "valdoria-online",
    storageBucket: "valdoria-online.firebasestorage.app",
    messagingSenderId: "68595451610",
    appId: "1:68595451610:web:8041b8aa1cd7961edac7e3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const dbRef = ref(db, 'reino');