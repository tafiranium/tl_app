

class CopyConnect {
    constructor(vp_list, buttons, type, int, ats) {
        this.copyButton     =   buttons[0]
        this.checksButtons  =   buttons[1]
        this.help = buttons[2]
        this.key_buffer = []
        this.int = int
        this.ats = ats
        this.hot_keys()
        this.type = type
        this.vp = vp_list
        this.connect_click()

        this.need_traffic = (this.type[0] != "open" & this.type[0] != "return" & ["", "Не задан"].includes(this.ats["traffic"])) 
        this.need_comment = (["market", "mobile", "takeup"].includes(this.type[0]) & (this.ats["comment"] == "Не задан" || this.ats["comment"] == ""))

        this.checks(false)
    }

    format_uv(table) {
        for (let i=0; i<table.length; i++) {if (table[i] == -1) {table[i] = ""}}
        let send = table.join("\t")
        return send
    }

    checks(no_start = true) {
        if (this.checksButtons[1].classList.contains("checked") & this.type[0] == "buyer") {this.vp[17] = 1} else {this.vp[17] = -1}
        if (this.vp[31]) {if (this.checksButtons[0].classList.contains("checked")) {this.vp[32] = this.vp[31]; this.vp[31] = -1;}}
        if (this.need_traffic) {
            if (no_start) alert("Введите трафик!"); 
            let dc = document.querySelector(".detail-view.table tr:nth-child(19)")
            let f = dc.querySelector("th")
            let s = dc.querySelector("td")
            f.style.background = "#C44536"
            f.style.color      = "white"
            s.style.background = "#C44536"
            s.style.color      = "white"
            return false;
        }
        if (this.need_comment) {
            if (no_start) alert("Введите комментарий с номером заказа!"); 
            let dc = document.querySelector(".detail-view.table tr:nth-child(21)")
            let f = dc.querySelector("th")
            let s = dc.querySelector("td")
            f.style.background = "#C44536"
            f.style.color      = "white"
            s.style.background = "#C44536"
            s.style.color      = "white"
            return false;
        }
        return true
    }

    key(k) {return(this.key_buffer.includes(k))}

    hot_keys() {
        
        document.onkeydown = (e) => {
            if (!this.key_buffer.includes(e.code)) {
                this.key_buffer.push(e.code)
            }
        }

        document.onkeyup = (e) => {
            if (this.key_buffer.includes(e.code)) {
                if (this.key("AltLeft") && this.key("KeyS")) {
                    console.clear()
                    if (this.checks()) {
                        navigator.clipboard.writeText(this.format_uv(this.vp))
                            .then(() => {console.log(`Успешно скопировано в буфер обмена! (Alt+S)`)})
                            .catch(err => {console.log("Ошибка", err)}); 
                        this.key_buffer.pop("AltLeft")
                    }
                }

                if (this.key("AltLeft") && this.key("KeyA")) {
                    this.int.ToggleCheck(this.checksButtons[0])
                    this.key_buffer.pop("AltLeft")
                }

                if (this.key("AltLeft") && this.key("KeyQ")) {
                    this.int.ToggleCheck(this.checksButtons[1], "checked")
                    this.key_buffer.pop("AltLeft")
                }

                this.key_buffer.pop(e.code)
            }
        }
    } 
    
    

    connect_click() {
        this.copyButton.addEventListener("click", (e) => {
                this.copyButton.style.background = "#438eb9"
                this.checks()
                console.clear()
                navigator.clipboard.writeText(this.format_uv(this.vp))
                    .then(() => {console.log(`Успешно скопировано в буфер обмена!`)})
                    .catch(err => {console.log("Ошибка", err)});
    })}
}    
