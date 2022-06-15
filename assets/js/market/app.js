import { firebase } from '../firebase/firebase.js';
import { genericFunctions } from '../genericFunctions.js';
import { showModal } from '../modal/createModal.js';
import { addProduct } from './addProduct.js';
import { templateProduct } from './gridProduct.js';

//Redirección al index.
const funcs = new genericFunctions('index.html');

$(document).ready( ()=>{
    const uid = localStorage.getItem('uid');
    if( !uid ) funcs.redirect();
    else init(uid);
});


$(document).on('click', '#btn-logout', exit);

function exit(){
    firebase.auth.logout();
    localStorage.removeItem('uid');
    funcs.redirect();
}


const init = async (uid) => {
    const res = await firebase.db.getData('users', {uid});

    if(!res.success) funcs.resolveResponse(res);
    else{
        if(res.data.length == 0) exit();
        const data = res.data[0];
        
        const urlImg = data.photoURL != undefined
            ? data.photoURL
            : (await firebase.storage.downloadFiles(data.photoPath)).path;

        document.getElementById('img-profile').src = urlImg;
        setGrid();
    }
}


const setGrid = async (filter = null) => {
    const {success, msj, data} = await firebase.db.getData('products');
    if(success){
        const grid = document.getElementById('grid-products');
        grid.innerHTML = '';
        for(const {imgUrl, name, userUid, price} of data){
            const urlProdt = (await firebase.storage.downloadFiles(imgUrl)).path;
            const userData = (await firebase.db.getData('users', {uid: userUid})).data[0];

            const urlProfileImg = userData.photoURL != undefined
                ? userData.photoURL
                : (await firebase.storage.downloadFiles(userData.photoPath)).path;

            grid.innerHTML += templateProduct(urlProdt, urlProfileImg, name, userData.displayName, price);
        }
    }
    else showModal({html:msj}, 'error');
}


$(document).on('click', '#cta-addProduct', ()=>{
    new addProduct(setGrid);
});