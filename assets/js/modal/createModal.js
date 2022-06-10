export function showModal(config, status = null, callback = () => { }) {
    let preConfig = {
        confirmButtonText:'Entendido',
    };

    switch (status) {
        case 'error':
            Object.assign(
                preConfig,
                {
                    title: 'Ha ocurrido un error!',
                    icon: 'error',
                    confirmButtonColor: '#f27474',
                    iconColor: '#f27474'
                }
            );
            break;

        case 'success':
            Object.assign(
                preConfig, 
                {
                    title: 'En hora buena!',
                    icon: 'success',
                    confirmButtonColor:'#a5dc86',
                    iconColor: '#a5dc86'
                }
            );
            break;
    }

    Object.assign(config, preConfig);
    Swal.fire(config).then(callback);
}