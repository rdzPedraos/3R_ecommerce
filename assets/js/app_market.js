import { firebase } from './firebase/firebase.js';
//await firebase.downloadFiles('img/1/profile');
const redirect = () => window.location.href = 'index.html';

$(document).ready( ()=>{
    const uid = localStorage.getItem('uid');
    if( !uid ) redirect();
});


$(document).on('click', '#btn-logout', ()=>{
    firebase.auth.logout();
    localStorage.removeItem('uid');
    redirect();
});