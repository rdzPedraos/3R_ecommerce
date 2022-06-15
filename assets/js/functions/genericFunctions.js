import * as modal from '../modal/createModal.js';

export class genericFunctions{
    constructor(urlRedirect){
        this.urlRedirect = urlRedirect;
    }

    redirect = () =>  window.location.href = this.urlRedirect;

    //Toma la respuesta que arrojamos desde los métodos de firebase, y damos respuestas con modales según convenga:
    resolveResponse(res){
        if( res ){
            let cb = null;
            if( res.success && res.uid ){
                localStorage.setItem('uid', res.uid);
                cb = this.redirect;
            }
    
            modal.showModal({html: res.msj}, res.success ? 'success' : 'error', cb);
        }
    }
}
