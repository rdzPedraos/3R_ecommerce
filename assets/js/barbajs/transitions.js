function animation(data){
    const done = this.async();
    document.body.classList.add('loading');
    setTimeout( ()=>{
        document.body.classList.remove('loading');
        done();
    }, 500);
}

barba.init({
    transitions:[{
        name: 'prueba',
        leave: animation,
        enter: animation
    }]
});
