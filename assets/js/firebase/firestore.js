import{
    getFirestore, collection, addDoc, getDocs
} from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';


const generateResponse = ()=>{
    return {
        success: false,
        msj: '',
        data: null
    }
}


const resForError = (error)=>{
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


const getMatches = (data, matches) => {
    const values = [];

    const isMatch = (record, matches) => {
        for( const property in matches ) {
            const match = matches[property];

            if( typeof match == 'object' ) isMatch(record, match);
            else if( record[property] != match ) return false;
        }
        return true;
    }
    
    data.forEach( (record) => { 
        const data = record.data();
        if( isMatch(record.data(), matches) ) values.push(data);
    });
    return values;
}


export class firestore {
    constructor(app){
        this.db = getFirestore(app);
    }

    async getData(table, matches){
        let res = generateResponse();

        await getDocs(
            collection(this.db, table),
        )
        .then( (data) => {
            res.success = true;
            res.data = data;
            res.data = getMatches(data, matches);
        })
        .catch( (error) => res.msj = resForError(error.code) );

        return res;
    }


    async addData(table, data){
        const res = generateResponse();

        await addDoc(
            collection(this.db, table),
            data
        )
        .then( (docRef) => { res.success = true; res.data.id = docRef.id; } )
        .catch( (error) => res.msj = resForError(error.code) );

        return res;
    }
}
