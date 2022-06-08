import * as firebase from './firebase.js';
import * as modal from './createModal.js';

const createModal = (res)=>{
    if( res.msj || res.success ) modal.showModal({html: res.msj}, res.success ? 'success' : 'error');
}

$(document).on('click', '[login-service]', async function(){
    const service = this.getAttribute('login-service');
    const res = await firebase.signInAPI(service);

    createModal(res);
});


$(document).on('click', '#btn-signin, #btn-register', async function(e){
    e.preventDefault();
    const id = this.getAttribute('id');
    const [email, password] = [
        $('#inp-email').val(),
        $('#inp-psw').val(),
    ];

    let res = null;
    if( id == 'btn-register' ){
        const psw2 = $('#inp-psw-2').val();
        if( password != psw2 ) createModal({success:false, msj:'Las contraseñas deben ser iguales'});
        else res = await firebase.createUser(email, password);
    }
    else res = await firebase.signInUser(email, password);
    
    createModal(res);
});
