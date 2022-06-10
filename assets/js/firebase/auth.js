import { 
    getAuth, signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";


const generateResponse = ()=>{
    return {
        success: false,
        msj: '',
        user: null,
        uid: null,
    }
}


export class authentication{
    constructor(app){
        this.auth = getAuth(app);
    }
    
    _resForError(error){
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
        
    async createUser(email, password){
        const res = generateResponse();
    
        await createUserWithEmailAndPassword( this.auth, email, password )
        .then( (userData) => {
            res.success = true;
            res.uid = userData.user.uid;
        })
        .catch( (error) => res.msj = this._resForError(error.code) )
    
        return res;
    }
    
    async signInUser(email, password){
        const res = generateResponse();
    
        await signInWithEmailAndPassword( this.auth, email, password )
        .then( (userData) =>{
            res.success = true;
            res.uid = userData.user.uid;
        })
        .catch((error) => res.msj = this._resForError(error.code) );
    
        return res;
    }
    
    async signInAPI(service){
        const res = generateResponse();
        let provider = null;
    
        switch(service){
            case 'google':  provider = new GoogleAuthProvider(); break;
            case 'facebook':provider = new FacebookAuthProvider(); break;
            default:
                res.msj = 'Tipo de servicio no reconocido';
        }
    
        if ( provider != null ) 
            await signInWithPopup(this.auth, provider)
            .then( (userData) => {
                const {user: {email, photoURL, displayName, uid}} = userData;

                res.success = true;
                res.user = {email, photoURL, displayName, uid};
                res.uid = uid;
            })
            .catch( (error) => res.msj = this._resForError(error.code));
    
        return res;
    }

    logout(){ signOut(this.auth); }
}
