import { firebase } from './firebase/firebase.js';
import * as modal from './modal/createModal.js';

//Redirección al market.
const redirect = () => window.location.href = 'market.html';

//Una vez inicie, validamos que no tengamos una cookie de una sesión abierta.
$(document).ready( () => {
    const uid = localStorage.getItem('uid');
    if( uid ) redirect();
});

//Toma la respuesta que arrojamos desde los métodos de firebase, y damos respuestas con modales según convenga:
const resolveResponse = (res) => {
    if( res ){
        let cb = null;
        if( res.success && res.uid ){
            localStorage.setItem('uid', res.uid);
            cb = redirect;
        }

        modal.showModal({html: res.msj}, res.success ? 'success' : 'error', cb);
    }
}


$(document).on('click', '[login-service]', async function(){
    const service = this.getAttribute('login-service');
    const res = await firebase.auth.signInAPI(service);

    if( res.user ){
        const {success, msj, data} = await firebase.db.getData('users', {uid: res.uid});
        
        if(success){
            if( data.length == 0 ) await firebase.db.addData('users', res.user);
        }
        else modal.showModal({html: msj}, 'error');
    }

    resolveResponse(res);
});



$(document).on('click', '#btn-signin', async function(e){
    e.preventDefault();

    const [email, password] = [
        $('#inp-email').val(),
        $('#inp-psw').val(),
    ];

    const res = await firebase.auth.signInUser(email, password);
    resolveResponse(res);
});





//----------- Register form:
const idCtaUploadImg = '#upload-img';
const idInputFile = '#inp-img';

$(document).on('click', '#btn-register', async function(e){
    e.preventDefault();

    const fields = {
        img:    {id:'inp-img',   ref:'imagen de perfil',msj:'La imágen no ha sido cargada.'},
        name:   {id:'inp-name',  ref:'nombre',          msj:'Los nombres no deben contener números ni ser mayores a 10 caracteres', rgx:/^([a-zA-Zá-úÁ-Úñ]{3,10} ?)+$/},
        email:  {id:'inp-email', ref:'email',           msj:'Email incorrecto, ingrese algo como exam@ple.com',                     rgx:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/},
        psw:    {id:'inp-psw',   ref:'contraseña',      msj:'La contraseña debe contener como minimo 4 caracteres',                 rgx:/^[\w\d\/\*\+\-\$\&]{4,}$/},
    };

    let valid = true;
    for(const id in fields){
        const field = fields[id];
        const val = document.getElementById(field.id).value;
        let obs = null;

        if( !val ) obs = 'El campo «'+field.ref+'» no puede estar vacío.';
        else if( field.rgx && !field.rgx.test(val) ) obs = field.msj;

        if( obs ){
            modal.showModal({text: obs}, 'error');
            valid = false;
            break;
        }
        field.value = val;
    }

    //Si todo está bien:
    if( valid ){
        const {success, msj, uid} = await firebase.auth.createUser(fields.email.value, fields.psw.value);
        let obs = null;

        if( success ){
            const path = 'img/'+uid+'/profile';
            const file = $(idInputFile)[0].files[0];

            const resImg = await firebase.storage.uploadFiles(path, file);
            if( resImg.success ){
                const resUser = await firebase.db.addData('users', {
                    uid,
                    email: fields.email.value, 
                    displayName:fields.name.value, 
                    photoPath: resImg.path,
                });

                if(!resUser.success) obs = resUser.msj;
            }
            else obs = resImg.msj;
        }
        else obs = msj;

        resolveResponse({
            success: obs == null,
            uid,
            msj: obs
        });
    }
});



$(document).on('click', idCtaUploadImg, () => $(idInputFile)[0].click() );
$(document).on('change', idInputFile, async function(){
    const SIZE_MAX = 10//10MB;
    const file = this.files[0];
    let obs = null;


    if(file.size == 0) obs = 'El tamaño del archivo debe ser mayor a 0.';
    else if(file.size > SIZE_MAX*1024*1024) obs = 'El tamaño del archivo no puede ser mayor a '+SIZE_MAX+'Mb.';
    else if(file.type.split('/')[0] != 'image') obs = 'El formato del archivo cargado no es una imágen.';

    let url = '';
    if( obs ){
        modal.showModal({text: obs}, 'error');
        this.value = '';
    }
    else url = URL.createObjectURL(file);
    $(idCtaUploadImg).css('background-image', 'url('+url+')');
});
