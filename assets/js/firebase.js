import { firebaseConfig } from "./config.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { 
    getAuth, signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import{
    getFirestore, collection, addDoc, getDocs
} from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js'


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const generateResponse = ()=>{
    return {
        success: false,
        msj: ''
    }
}

const resForError = (error) => {
    switch(error){
        case 'auth/email-already-in-use':   return 'El email ingresado ya está en uso.';
        case 'auth/invalid-email':          return 'El email ingresado tiene errores';
        case 'auth/internal-error':         return 'El formulario ha sido comprometido. Falta información por diligenciar';
        case 'auth/popup-closed-by-user':   return false;
        case 'auth/weak-password':          return 'La contraseña ingresada es muy corta'; break;
        case 'auth/wrong-password':
        case 'auth/user-not-found':         return 'contraseña y/o correo incorrecto';
        default:
            return error;
    }
}


export const logout = () => {
    signOut(auth);
}



export const createUser = async (email, password) => {
    const res = generateResponse();

    await createUserWithEmailAndPassword( auth, email, password )
    .then( (userData) => {
        logout();
        res.success = true;
    })
    .catch( (error) => res.msj = resForError(error.code) )

    return res;
}




export const signInUser = async (email, password) => {
    const res = generateResponse();

    await signInWithEmailAndPassword( auth, email, password )
    .then( (userData) => res.success = true )
    .catch((error) => res.msj = resForError(error.code) );

    return res;
}



export const signInAPI = async (service) => {
    const res = generateResponse();
    let provider = null;

    switch(service){
        case 'google':  provider = new GoogleAuthProvider(); break;
        case 'facebook':provider = new FacebookAuthProvider(); break;
        default:
            res.msj = 'Tipo de servicio no reconocido';
    }

    if ( provider != null ) 
        await signInWithPopup(auth, provider)
        .then( (data) => res.success = true )
        .catch( (error) => res.msj = resForError(error.code));

    return res;
}



export const getData = async (table, matches) => {
    let res = generateResponse();

    await getDocs(
        collection(db, table),
        data
    )
    .then( (data) => {
        res.success = true;
        res.data = getMatches(data, matches);
    })
    .catch( (error) => res.msj = resForError(error.code) );

    return res;
}




export const getMatches = (data, matches) => {
    const values = [];

    const isMatch = (record, matches) => {
        for( const property in matches ) {
            const match = matches[property];

            if( typeof match == 'object' ) isMatch(record, match);
            else if( record[property] != match ) return false;
        }
        return true;
    }
    
    data.forEach( (record) => { if( isMatch(record, matches) ) values.push(record) });
    return values;
}



export const addData = async (table, data) => {
    const res = generateResponse();

    await addDoc(
        collection(db, table),
        data
    )
    .then( (docRef) => res.success = true )
    .catch( (error) => res.msj = resForError(error.code));

    return res;
}