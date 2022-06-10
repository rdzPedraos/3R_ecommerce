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
    
    data.forEach( (record) => { if( isMatch(record, matches) ) values.push(record) });
    return values;
}


export class firestore {
    constructor(app){
        this.db = getFirestore(app);
    }

    async getData(table, matches){
        let res = generateResponse();

        await getDocs(
            collection(this.db, table)
        )
        .then( (data) => {
            res.success = true;
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
        .then( (docRef) => res.success = true )
        .catch( (error) => res.msj = resForError(error.code) );

        return res;
    }
}
