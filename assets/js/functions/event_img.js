export class eventImg{
    _SIZE_MAX = 10485760; //10MB

    constructor(idInput, idDiv){
        $(document).on('click', '#'+idDiv, () => document.getElementById(idInput).click() );

        $(document).on('change', '#'+idInput, function(){
            const file = this.files[0];
            let obs = null;
        
            if(file.size == 0) obs = 'El tamaño del archivo debe ser mayor a 0.';
            else if(file.size > this._SIZE_MAX) obs = 'El tamaño del archivo no puede ser mayor a '+SIZE_MAX+'Mb.';
            else if(file.type.split('/')[0] != 'image') obs = 'El formato del archivo cargado no es una imágen.';
        
            let url = '';
            if( obs ){
                Swal.showValidationMessage(obs);
                this.value = '';
            }
            else url = URL.createObjectURL(file);

            $( '#'+idDiv ).css('background-image', 'url('+url+')');
        });
    }
}