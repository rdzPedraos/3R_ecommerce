import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { firebaseConfig } from "./config.js";
import { authentication } from "./auth.js";
import { firestore } from "./firestore.js";
import { Storage } from "./storage.js";

const app = initializeApp(firebaseConfig);

export const firebase = {
    auth: new authentication(app),
    db: new firestore(app),
    storage: new Storage(app)
}