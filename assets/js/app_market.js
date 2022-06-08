import * as firebase from './firebase.js';

console.log( findGetParameter(uid));

/*firebase.getUserWithUid();
$('#btn-logout').on('click', ()=>{
    firebase.logout();
})*/



function findGetParameter(parameterName) {
    var result = null,
        tmp = [];

    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}