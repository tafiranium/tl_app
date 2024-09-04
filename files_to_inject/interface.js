class Interface {

    async run(html) {
      this.html = html

        const text_color = "#616161"
        const background_color = "#F0F0F0"
        const border_color = "#e0e0e0"
        const border_second_color = "#0088cc"

        const styles = {
              appwrapper: {
                height: "auto",
                width: "auto",
                position: "relative",
                zIndex: "100",
                display: "grid",
                gridTemplateColumns: "1fr 1fr"
                // gap: "3px"
              },
            spans: {
              position: "relative",
              height: "60px",
              width: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: text_color,
              background: background_color,
              border: "solid 0.5px" + border_color,
              fontSize: "12px",
              fontWeight: "100",
              fontFamily: "Verdana, Roboto, 'Open Sans'",
              cursor: "pointer",
              userSelect: "none",
              textAlign: "center"
            }
          }
          
          this.html.querySelector(".sidebar-collapse").style.marginBottom = "0"; 
          let wrapper = document.createElement("div")
          wrapper.classList.add("wrapper")
          Object.assign(wrapper.style, styles["appwrapper"])

          const bst = {
            "app_icon": [`ฅ^•⩊•^ฅ`, {
              fontWeight: "100",
              fontSize: "20px",
              transition: "transform 0.1s ease-in-out, color 0.2s ease-in-out"
            }],
            "app_copy_button": ["Копировать</br>Alt+S",  {}],
            "app_sbp": ["Сбп</br>Alt+A", {}],
            "app_dop": ["Допродажа</br>Alt+W", {}],
            "app_dc": ["Дк</br>Alt+Q", {}],
            "app_cut": ["Убрать копейки", {}],
            "app_telegram": ["Телеграм", {}],
            "app_error": ["Отчет об ошибке", {}]
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
          
          mass.forEach((e) => {e.addEventListener("click", () => {
            this.ToggleCheck(e, [border_color, border_second_color])
            if (!this.check(e)) e.style.borderLeft = "solid 3px " + border_second_color
          })});
          
          [["mouseover", border_second_color, border_second_color],
           ["mouseout",  border_color,        text_color]].forEach(el => {
            mass.forEach((e) => {e.addEventListener(el[0], () => {
              if (!this.check(e)) e.style.borderLeft = "solid 3px " + el[1]
              e.style.color = el[2]
            })});
          })
          
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
            buttons_list["app_error"].style.color = border_second_color
          })

          buttons_list["app_error"].addEventListener("mouseout", ()=> {
            buttons_list["app_error"].style.color = text_color
          })

          buttons_list["app_error"].addEventListener("click", ()=> {
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
          
          let second_mass = ["app_copy_button", "app_telegram", "app_error"].map(i => {return buttons_list[i]})
          let move = [["mouseover", border_second_color], ["mouseout",  text_color]]
          move.forEach(el => {second_mass.forEach((e) => {e.addEventListener(el[0], () => {e.style.color = el[1]})});})

          return [
            buttons_list["app_copy_button"], 
            [buttons_list["app_sbp"], buttons_list["app_dc"], buttons_list["app_dop"], buttons_list["app_cut"]], 
            buttons_list["app_icon"]
          ]
    }

    ToggleCheck(el, colors, cls="checked") {
        console.clear()
        el.classList.toggle(cls)
        if (this.check(el)) {el.style.borderLeft = "solid 4px" + colors[1]} 
        else {el.style.borderLeft = "solid 4px" + colors[0]}
    }

    check(el, cls="checked") {return (el.classList.contains(cls))}
}
