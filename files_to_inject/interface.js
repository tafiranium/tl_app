class Interface {

    async run(html) {
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
            "app_cut": ["Убрать копейки</br>Alt+Z", {
              transition: "0.5s ease-in-out",
              background: start_color,
            }],
            "app_telegram": ["Телеграм", {
              transition: "0.1s ease-in-out",
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

          let mass = [buttons_list["app_dc"], buttons_list["app_sbp"], buttons_list["app_dop"], buttons_list["app_cut"]]
          let all = [
            buttons_list["app_dop"], buttons_list["app_icon"], 
            buttons_list["app_sbp"], buttons_list["app_copy_button"], 
            buttons_list["app_dc"],  buttons_list["app_error"], 
            buttons_list["app_cut"], buttons_list["app_telegram"]
          ]  
          
          mass.forEach((e) => {e.addEventListener("click", () => {this.ToggleCheck(e)})});
          buttons_list["app_copy_button"].addEventListener("mousedown", (e) => {e.target.style.background = "#a1c8e7"})
          
          all.forEach(e => {wrapper.appendChild(e)});
          this.html.querySelector(".main-container .sidebar").appendChild(wrapper)

          let min_icon = document.querySelector(".sidebar#sidebar")
          wrapper.style.display =  min_icon.classList.contains("menu-min")?"none":"grid"

          min_icon.addEventListener("click", (e) => {
            wrapper.style.display =  min_icon.classList.contains("menu-min")?"none":"grid"
          })

          let min_icon_arrow = document.querySelector(".sidebar#sidebar i")
          min_icon_arrow.addEventListener("click", (e) => {
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

          buttons_list["app_telegram"].addEventListener("click", ()=> {
            window.open('https://t.me/+WBv4WSieLmwwMjZi');
          })
          
          buttons_list["app_copy_button"].addEventListener("mouseover", ()=> {
            buttons_list["app_copy_button"].style.background = "#bbe5e7"
          })

          buttons_list["app_copy_button"].addEventListener("mouseout", ()=> {
            buttons_list["app_copy_button"].style.background = start_color
          })

          buttons_list["app_telegram"].addEventListener("mouseover", ()=> {
            buttons_list["app_telegram"].style.background = "#01bde1"
            buttons_list["app_telegram"].style.color = "white"
          })

          buttons_list["app_telegram"].addEventListener("mouseout", ()=> {
            buttons_list["app_telegram"].style.background = start_color
            buttons_list["app_telegram"].style.color = "#383c39"
          })

          return [
            buttons_list["app_copy_button"], 
            [buttons_list["app_sbp"], buttons_list["app_dc"], buttons_list["app_dop"], buttons_list["app_cut"]], 
            buttons_list["app_icon"]
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
