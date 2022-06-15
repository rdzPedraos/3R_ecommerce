import { firebase } from '../firebase/firebase.js';
import { genericFunctions } from '../functions/genericFunctions.js';
import { eventImg } from '../functions/event_img.js';
import { showModal } from '../modal/createModal.js';
import { templateProduct, templateModalAddProducts } from './gridProduct.js';

//Redirección al index.
const funcs = new genericFunctions('index.html');
const grid = document.getElementById('grid-products');
const idInputFile = 'inp-img';

$(document).ready( ()=>{
    const uid = localStorage.getItem('uid');
    if( !uid ) funcs.redirect();
    else init(uid);
});


$(document).on('click', '#btn-logout', ()=>{
    firebase.auth.logout();
    localStorage.removeItem('uid');
    funcs.redirect();
});


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
        grid.innerHTML = '';
        for(const product of data) setProduct(product);
    }
    else showModal({html:msj}, 'error');
}


const setProduct = async (product) => {
    const {imgUrl, name, userUid, price} = product;

    const urlProdt = (await firebase.storage.downloadFiles(imgUrl)).path;
    const userData = (await firebase.db.getData('users', {uid: userUid})).data[0];

    const urlProfileImg = userData.photoURL != undefined
        ? userData.photoURL
        : (await firebase.storage.downloadFiles(userData.photoPath)).path;

    grid.innerHTML += templateProduct(urlProdt, urlProfileImg, name, userData.displayName, price);
}


$(document).on('click', '#cta-addProduct', ()=>{
    new eventImg(idInputFile, 'upload-img');
    showModal({
        title: 'Agregar productos',
        html: templateModalAddProducts,
        preConfirm: submitProduct
    });
});


async function submitProduct(){
    const fields = {
        img:    {id:'inp-img',          ref:'Imágen del producto',  msj:'La imágen no ha sido cargada.'},
        name:   {id:'inp-productName',  ref:'Nombre del producto',  msj:'El nombre no debe contener más de 40 caracteres', rgx:/^[a-zA-Zá-úÁ-Úñ0-9\- ]{3,40}$/},
        price:  {id:'inp-productPrice', ref:'Precio del producto',  msj:'El precio tiene que ser datos en números, sin puntos ni comas.', rgx:/^[0-9]|[1-9][0-9]*$/},
    };

    //--- valid:
    let obs = null;
    for(const id in fields){
        const field = fields[id];
        const val = document.getElementById(field.id).value;

        if( !val ) obs = 'El campo «'+field.ref+'» no puede estar vacío.';
        else if( field.rgx && !field.rgx.test(val) ) obs = field.msj;

        if( obs ){
            Swal.showValidationMessage(obs);
            break;
        }
        field.value = val;
    }

    //Si todo está bien:
    if( !obs ){
        const uid = localStorage.getItem('uid');

        const path = 'products/'+uid+'/'+fields.name.value;
        const file = document.getElementById(idInputFile).files[0];
        const resImg = await firebase.storage.uploadFiles(path, file);

        const data = {
            userUid: uid,
            name: fields.name.value,
            price: fields.price.value,
            imgUrl: resImg.path
        }

        if( resImg.success ){
            const resProduct = await firebase.db.addData('products', data);

            if(!resProduct.success) obs = resProduct.msj;
            else setProduct(data);
        }
        else obs = resImg.msj;
    }

    if( obs != null ) Swal.showValidationMessage(obs);
    else showModal({html:'Registro guardado con éxito!'}, 'success');
}