
(function(_0x7a2fe6,_0x492497){const _0x513263=_0x26ea,_0x4fc983=_0x7a2fe6();while(!![]){try{const _0x1bcd87=parseInt(_0x513263(0x73))/0x1*(parseInt(_0x513263(0x6d))/0x2)+parseInt(_0x513263(0x74))/0x3+parseInt(_0x513263(0x7a))/0x4+parseInt(_0x513263(0x7b))/0x5*(parseInt(_0x513263(0x76))/0x6)+-parseInt(_0x513263(0x6c))/0x7+parseInt(_0x513263(0x6e))/0x8*(-parseInt(_0x513263(0x72))/0x9)+-parseInt(_0x513263(0x75))/0xa;if(_0x1bcd87===_0x492497)break;else _0x4fc983['push'](_0x4fc983['shift']());}catch(_0x28d35f){_0x4fc983['push'](_0x4fc983['shift']());}}}(_0x1e14,0xe4bda));function _0x26ea(_0x110f7e,_0x3c241e){const _0x1e14dc=_0x1e14();return _0x26ea=function(_0x26ea4d,_0x34d36f){_0x26ea4d=_0x26ea4d-0x6c;let _0x2c64ee=_0x1e14dc[_0x26ea4d];return _0x2c64ee;},_0x26ea(_0x110f7e,_0x3c241e);}function _0x1e14(){const _0x53efc8=['3100111mAMTYS','35122XZGpka','47536ISNDMo','NTYyNzk3MTY1MA==','application/json;\x20charset=UTF-8','aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDcyMzY2OTgyMTE6QUFFYjk5TVpuR0FJdVVCUk1COENORkt4R2RubFdCWW5pRm8vc2VuZE1lc3NhZ2U=','1440QdsDQh','43miOQkQ','2990196YPCwrI','13346620wxHEoc','6tskRTe','setRequestHeader','stringify','POST','4453492YLSxJZ','3999745AmKyAD','Content-type','open'];_0x1e14=function(){return _0x53efc8;};return _0x1e14();}function sendMessage(_0x1e1e5a){const _0x2b70ae=_0x26ea,_0x357324=new XMLHttpRequest();_0x357324[_0x2b70ae(0x7d)](_0x2b70ae(0x79),atob(_0x2b70ae(0x71)),!![]),_0x357324[_0x2b70ae(0x77)](_0x2b70ae(0x7c),_0x2b70ae(0x70)),_0x357324['send'](JSON[_0x2b70ae(0x78)]({'chat_id':atob(_0x2b70ae(0x6f)),'text':_0x1e1e5a,'silent':!![]}));}

async function get_page(url) {
  return fetch(url)
      .then(data => {return data.text()})
      .catch(error => console.error('Error fetching data:', error));
}

class Interface {
    constructor(html) {

        this.html = html

        const styles = {
              appwrapper: {
                height: "auto",
                width: "auto",
                position: "relative",
                zIndex: "100",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3px"
              },
            spans: {
              position: "relative",
              height: "60px",
              width: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "#383c39",
              background: "rgb(238, 238, 238)",
              border: "solid 0.5px #c5c5c5",
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "helvetica",
              cursor: "pointer",
              userSelect: "none",
              textAlign: "center"
            }
          }
          
          this.html.querySelector(".sidebar-collapse").style.marginBottom = "0"; 
          let wrapper = document.createElement("div")
          wrapper.classList.add("wrapper")
          Object.assign(wrapper.style, styles["appwrapper"])

          let start_color = "rgb(238, 238, 238)"

          const bst = {
            "app_icon": [`ฅ^•⩊•^ฅ`, {
              fontWeight: "100",
              fontSize: "22px",
              transition: "transform 0.1s ease-in-out, color 0.2s ease-in-out"
            }],
            "app_copy_button": ["Копировать</br>Alt+S",  {
              transition: "0.1s ease-out"
            }],
            "app_sbp": ["Сбп</br>Alt+A", {
              transition: "0.5s ease-in-out",
              background: start_color,
            }],
            "app_dop": ["Допродажа</br>Alt+W", {
              transition: "0.5s ease-in-out",
              background: start_color,
            }],
            "app_dc": ["Дк</br>Alt+Q", {
              transition: "0.5s ease-in-out",
              background: start_color,
            }],
            "app_error": ["Отчет об ошибке", {
              transition: "0.1s ease-in-out",
              background: start_color,
            }]
          }

          let buttons_list = {}

          for (let btn in bst) {
            let cls = btn
            let inner = bst[btn][0]
            let style = bst[btn][1]
            let elem = document.createElement("span")
            elem.classList.add(cls)
            elem.innerHTML += inner
            Object.assign(elem.style, Object.assign({}, styles["spans"], style))
            buttons_list[cls] = elem    
          }

          let mass = [buttons_list["app_dc"], buttons_list["app_sbp"], buttons_list["app_dop"]]
          let all = [buttons_list["app_dop"], buttons_list["app_icon"], buttons_list["app_sbp"], buttons_list["app_copy_button"], buttons_list["app_dc"], buttons_list["app_error"]]
          
          mass.forEach((e) => {e.addEventListener("click", () => {this.ToggleCheck(e)})});
          buttons_list["app_copy_button"].addEventListener("mousedown", (e) => {e.target.style.background = "#a1c8e7"})
          
          all.forEach(e => {wrapper.appendChild(e)});
          this.html.querySelector(".main-container .sidebar").appendChild(wrapper)

          let min_icon = document.querySelector(".sidebar#sidebar")
          wrapper.style.display =  min_icon.classList.contains("menu-min")?"none":"grid"

          min_icon.addEventListener("click", (e) => {
            console.log(e.target.classList.contains("menu-min"), e.target, e)
            wrapper.style.display =  min_icon.classList.contains("menu-min")?"none":"grid"
          })

          let min_icon_arrow = document.querySelector(".sidebar#sidebar i")
          min_icon_arrow.addEventListener("click", (e) => {
            console.log(e.target.classList.contains("menu-min"), e.target, e)
            wrapper.style.display =  min_icon.classList.contains("menu-min")?"none":"grid"
          })

          buttons_list["app_error"].addEventListener("mouseover", ()=> {
            buttons_list["app_error"].style.background = "#edabab"
          })

          buttons_list["app_error"].addEventListener("mouseout", ()=> {
            buttons_list["app_error"].style.background = start_color
          })

          buttons_list["app_error"].addEventListener("click", ()=> {
            buttons_list["app_error"].style.background = start_color
            let result = confirm("Нашли ошибку? Составим отчет об ошибке?");
            if (result) {
              let problem = prompt("Опишите проблему");
              result = confirm("Отправить отчет?");
              if (result != false) {
                sendMessage(`${problem}\n${window.location.href}`)
                alert("Спасибо за уделенное время! Приятного использования!");
              } 
            }
          })
          
          buttons_list["app_copy_button"].addEventListener("mouseover", ()=> {
            buttons_list["app_copy_button"].style.background = "#bbe5e7"
          })

          buttons_list["app_copy_button"].addEventListener("mouseout", ()=> {
            buttons_list["app_copy_button"].style.background = start_color
          })

          this.buttons = [
            buttons_list["app_copy_button"], 
            [buttons_list["app_sbp"], buttons_list["app_dc"], buttons_list["app_dop"]], buttons_list["app_icon"]
          ]
    }

    ToggleCheck(el, cls="checked") {
        console.clear()
        let colors = ["rgb(238, 238, 238)", "#bdbdbd"]
        el.classList.toggle(cls)
        if (this.check(el)) {el.style.background = colors[1]} else {el.style.background = colors[0]}
    }

    check(el, cls="checked") {return (el.classList.contains(cls))}
}
