class CopyConnect {

    constructor() {
        this.CLASS_NAME = "CopyConnect"
    }

    async run(args) {

        let FU_NAME = "run"

        log("args: ", args, [this.CLASS_NAME, FU_NAME])

        this.traffic  = args["traffic"]
        this.comment  = args["comment"]
        this.reasons  = args["reasons"]

        this.all_list = args["templates"]["all_list"]
        this.html     = args["html"]

        this.all_tables_sorted  = args["tables"]
        this.interface          = args["interface"]
        this.analis             = args["analis"]

        this.money = this.analis.money_object

        this.temp = args["templates"]
        this.cat = this.temp["icons"]

        log("this.temp: ", this.temp, [this.CLASS_NAME, FU_NAME])

        this.buttons        =   this.interface
        this.copyButton     =   this.buttons[0]
        this.checksButtons  =   this.buttons[1]
        this.cat_button     =   this.buttons[2]

        log("this.buttons: ", this.buttons, [this.CLASS_NAME, FU_NAME])

        this.deny = args["deny"]
        this.key_buffer     = []
        this.hot_keys()
        
        this.type = this.analis.type_of_page[0]
        this.vp   = this.analis.vp

        log("this.type: ", this.type, [this.CLASS_NAME, FU_NAME])
        log("this.vp: ", this.vp, [this.CLASS_NAME, FU_NAME])

        this.connect_click()
        let need = this.temp["need"]
        
        // console.log(!need["traffic"].includes(this.type))

        this.need_traffic =  (!need["traffic"].includes(this.type)  &  this.deny.includes(this.traffic)) 
        this.need_comment =  (need["comment"].includes(this.type)   &  this.deny.includes(this.comment))
        this.need_reasons  = (need["reasons"].includes(this.type)   &  this.deny.includes(this.reasons)) 
        
        this.not_allow = (this.need_reasons || this.need_comment || this.need_traffic)

        if (this.not_allow) {this.cat_button.innerHTML = this.cat[1]} else {

            this.cat_button.innerHTML = this.cat[0][0]

            this.cat_button.addEventListener("mouseover", () => {
                this.cat_button.innerHTML       =  this.cat[0][1]; 
                this.cat_button.style.fontSize  = "13px"; 
            })

            this.cat_button.addEventListener("mouseout", () => {
                this.cat_button.innerHTML       =  this.cat[0][0]; 
                this.cat_button.style.fontSize  = "22px";
            })

        } this.checks(false);

    }

    format_uv(table) { return table.map((e) => ((e == -1) ? "" : e)).join("\t") }
    checked(btn) {return btn.classList.contains("checked")}

    checks(no_start = true) {

        let template = {
            "traffic": ["Введите трафик!", [19], this.need_traffic, false],
            "comment": [{return: "Введите комментарий, опишите причину возврата чека!", 
                         market: "Введите комментарий с номером заказа!", 
                         no_item: "Опишите непокупку (обстоятельства, причина)"
            }, [21], this.need_comment, true],
            "reasons": ["Введите причину не покупки!", [20], this.need_reasons, false]
        }

        for (let i in template) {

            let msg = template[i][0]
            let num = template[i][1]
            let che = template[i][2]
            let tra = template[i][3]

            if (che) {
                if (tra) { msg = msg[this.type] }
                if (no_start) alert(msg); num = num.map((n) => {return this.html.querySelector(`.detail-view.table tr:nth-child(${n})`)});
                num.map((x) => {[x.querySelector("th"), x.querySelector("td")].map((e) => {e.style.background="#C44536"; e.style.color="white"})})
            }
        } 

        if (!this.not_allow) {

            if (this.checked(this.checksButtons[1]) & this.type == "buyer") { this.vp[17] = 1
                if (this.checked(this.checksButtons[2]) & this.type == "buyer") { this.vp[17] = 0
                } else { this.vp[17] = 1 }
            } else {this.vp[17] = -1}

            if (this.analis.refuse_count) {
                if (this.checked(this.checksButtons[2]) & this.type == "buyer") {
                    if (!!((this.vp[3] == 1) & (this.vp[this.all_list[this.traffic]] == 1))) {
                        this.vp[this.all_list[this.traffic]] = 0; this.vp[3] = 0;
                        if (this.vp[17] != -1) {this.vp[17] = 0}
                        if ((this.vp[27] != -1) & (this.vp[27] == 1)) {this.vp[27] = 0}
                    };
                
                } else if (!this.checked(this.checksButtons[2]) & this.type == "buyer") {
                    if (!!((this.vp[3] == 0) & (this.vp[this.all_list[this.traffic]] == 0))) {
                        this.vp[this.all_list[this.traffic]] = 1; this.vp[3] = 1;
                        if (this.vp[17] != -1) {this.vp[17] = 1}
                        if (this.vp[27] != -1 & (this.vp[27] == 0)) {this.vp[27] = 1}
                    };
                }
            }

            if (Object.keys(this.money).length == 3) {

                let num_object = {31: false, 32: true}
                let num = Object.keys(num_object)

                num.map(e => {
                    if (this.money[e][0] == "-1" & this.checked(this.checksButtons[0]) == num_object[e]) {
                        let another = num[(e == num[0]) ? 1:0]
                        this.money[e] = this.money[another]
                        this.money[another] = ["-1", "-1"]
                    }
                })
            }

            let check_cut = this.checked(this.checksButtons[3])
            let check_cut_number = (check_cut == true) ? 1:0
            for (let i in this.money) {this.vp[i] = this.money[i][check_cut_number]}

        } else {return [false, this.vp]} return [true, this.vp];
    } 

    key(k) {return(this.key_buffer.includes(k))}

    clipText(msg, hot=false) {
        if (this.checks(true)[0] == true) {

            navigator.clipboard.writeText(this.format_uv(msg))
                .then(() => {console.log(`Успешно скопировано в буфер обмена! (Alt+S)`)})
                .catch(err => {console.log("Ошибка", err)}); 

            if (hot) this.key_buffer.pop("AltLeft")
        }
    }

    hot_keys() {
        
        document.onkeydown = (e) => {
            if (!this.key_buffer.includes(e.code)) {
                this.key_buffer.push(e.code)
            }
        }

        document.onkeyup = (e) => {

            if (this.key_buffer.includes(e.code)) {

                if (this.key("AltLeft") && this.key("KeyS")) { this.clipText(this.vp, true)}

                let template = {"A": 0, "Q": 1, "W": 2}
                for (let i in template) {
                    if (this.key("AltLeft") && this.key(`Key${i}`)) {
                        this.interface.ToggleCheck(this.checksButtons[template[i]])
                        this.key_buffer.pop("AltLeft")
                    }
                }

                this.key_buffer.pop(e.code)
            }
        }
    } 

    connect_click() {
        this.copyButton.addEventListener("click", (e) => {
                this.copyButton.style.background = "rgb(238, 238, 238)"
                this.clipText(this.vp, false)
    })}
}    
