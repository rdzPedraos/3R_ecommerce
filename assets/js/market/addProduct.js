import { showModal } from '../modal/createModal.js';
import { firebase } from '../firebase/firebase.js';
import { eventImg } from '../functions/event_img.js';


const template = `
    <div class="form">
        <div div style="display: grid;  grid-template-columns: 1fr 1fr; gap:1em;">
            <div>
                <div class="label">
                    <i class="fa-solid fa-tag"></i>
                    <label for="inp-nameProduct">Ingrese el nombre del producto</label>
                </div>
                <input type="text" id="inp-productName" placeholder="Tasa de doña Juana">

                <div class="label">
                    <i class="fa-solid fa-piggy-bank"></i>
                    <label for="inp-productPrice">Ingrese el precio del articulo</label>
                </div>
                <input type="number" id="inp-productPrice" placeholder="000">
            </div>

            <div>
                <div id="upload-img" upload-img class="input-image" style="width:100%; height:100%">
                    <div> <span> Subir imágen </span> </div>
                    <input type="file" id="inp-img" accept="image/*" style="display:none">
                </div>
            </div>
        </div>
    </div>
`;


const idInputFile = 'inp-img';
export class addProduct {
    constructor(callBack = null){
        this.showInterfaz(callBack);
    }

    showInterfaz(cb){
        new eventImg(idInputFile, 'upload-img');
        showModal({
            title: 'Agregar productos',
            html: template,
            preConfirm: this.submitProduct
        }, null, cb);
    }

    async submitProduct(){
        const fields = {
            img:    {id:'inp-img',          ref:'Imágen del producto',  msj:'La imágen no ha sido cargada.'},
            name:   {id:'inp-productName',  ref:'Nombre del producto',  msj:'El nombre no debe contener más de 40 caracteres', rgx:/^[a-zA-Zá-úÁ-Úñ0-9\- ]{3,40}$/},
            price:  {id:'inp-productPrice', ref:'Precio del producto',  msj:'El precio tiene que ser datos en números, sin puntos ni comas.', rgx:/^[0-9]|[1-9][0-9]*$/},
        };


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
            if( resImg.success ){
                const resUser = await firebase.db.addData('products', {
                    userUid: uid,
                    name: fields.name.value,
                    price: fields.price.value,
                    imgUrl: resImg.path
                });

                if(!resUser.success) obs = resUser.msj;
            }
            else obs = resImg.msj;
        }

        if( obs != null ) Swal.showValidationMessage(obs);
        else{
            showModal({html:'Registro guardado con éxito!'}, 'success');
        }
    }
}

