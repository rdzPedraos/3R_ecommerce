import * as firebase from './firebase.js';

$(document).on('click', '#btn-logout', ()=>{
    firebase.logout();
})



const structure = {
    val: 'a',
}

const data = [
    {
        uid: '1',
        name: 'Juanito Caramelo',
        otro: {
            last_name:'default'
        }
    },
    {
        uid: '2',
        val: 'a',
        name: 'Carlita',
        otro: {
            last_name:'Mariadelvis'
        }
    },
    {
        uid: '3',
        val: 'a',
        name: 'Pepito mario',
        otro: {
            last_name:'a'
        }
    },
    {
        uid: '4',
    }
]

console.log( firebase.getMatches(data, structure) )
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