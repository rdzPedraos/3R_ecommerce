import{
    getStorage, ref, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js';

const generateResponse = ()=>{
    return {
        success: false,
        msj: '',
        path: null
    }
}

//Storage:
export class storage{
    constructor(app){
        this.storage = getStorage(app);
    }

    async uploadFiles(url, file) {
        const res = generateResponse();
        const storageRef = ref(this.storage, url);
    
        await uploadBytes(storageRef, file)
        .then( (snapshot)=>{
            res.success = true;
            res.path = snapshot.metadata.fullPath;
        })
        .catch( (error) => res.msj = error );
    
        return res;
    }
    
    async downloadFiles(url){
        const res = generateResponse();
        const storageRef = ref(storage, url);
    
        await getDownloadURL(storageRef)
        .then( (url)=>{
            res.success = true;
            res.path = url;
        })
        .catch( (error) => res.msj = error );
    
        return res;
    }
}