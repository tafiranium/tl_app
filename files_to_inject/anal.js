class AnalIs {
    constructor() {
        this.CLASS_NAME = "AnalIs"
    }

    async run(args) {

        let FU_NAME = "run"
        log("async function", `${FU_NAME}(${args})`, [this.CLASS_NAME, FU_NAME])
        log("args", args, [this.CLASS_NAME, FU_NAME])

        this.ready = true

        this.html              = args["html"]
        this.cfg               = args["config"]
        this.all_tables_sorted = args["tables"]
        this.traffic           = this.all_tables_sorted[0]["traffic"]
        
        this.temp = this.cfg["type_settings"] 
        this.vp   =  Array(this.cfg["main"]["size"]).fill(-1)
        this.def  =  this.cfg["default"]
        
        this.temps    = args["templates"]
        this.all_list = args["templates"]["all_list"]
        this.deny     = args["deny"]

        this.tm  =  args["datetime"]
        this.ts  =  {}

        this.refuse_count = false

        log("all_variables", {
            "this.traffic": this.traffic,
            "this.temp": this.temp,
            "this.vp": this.vp,
            "this.def": this.def,
            "arguments": args
        }, [this.CLASS_NAME, FU_NAME])

        Object.keys(this.temp).forEach(element => {this.ts["t" + element.replace("_", "")] = this.temp[element]});
        log("this.temp -> obj.keys() -> this.ts", [this.temp, this.ts], [this.CLASS_NAME, FU_NAME])

        this.type_of_page_object = new Type(this.html, this.cfg, this.temp, this.all_tables_sorted[0]["return"])
        this.type_of_page = this.type_of_page_object.type
        this.return_type = false

        if (this.type_of_page[0] == "return") {

            let page = await this.get_return_bill()
            this.return_type = new Type(page, this.cfg, this.temp, true)

            this.vars = this.return_type.vars
        }

        this.copy_massive = [this.return_type, this.vars]

        log("this.type_of_page: ", this.type_of_page, [this.CLASS_NAME, FU_NAME]), 
        log("this.temp: ", this.temp, [this.CLASS_NAME, FU_NAME])
        this.current_temp = this.temp[this.type_of_page[0]][0]

        log("this.current_temp: ", this.current_temp, [this.CLASS_NAME, FU_NAME])
        for (let i = 1; i < this.current_temp.length; i++) {
            let e = this.current_temp[i]
            if (e.length == 1 & e[0] == false) {
                this.current_temp[i] = Array(this.def[2][i]).fill(-1)
            }
        }

        this.uv_turn = Object.keys(this.temps["uv_off"]).includes(this.traffic) 
        log("this.uv_turn: ", this.uv_turn, [this.CLASS_NAME, FU_NAME])

        this.Scan(this.current_temp) 
        return [this.type_of_page, this.vp]
    }

    async get_return_bill(url) {
        let bill = this.html.querySelector("#detail-view tr:nth-child(17) a")
        let bill_url = bill.getAttribute("href")
        let page = await get_page(bill_url)
        let html = document.createElement("div")
        html.innerHTML = page
        return html
    } 

    default_group(temp) {
        
        let FU_NAME = "default_group"
        log("async function", `${FU_NAME}(${temp})`, [this.CLASS_NAME, FU_NAME])

        let day  = this.type_of_page[1][2]
        log("day: ", day, [this.CLASS_NAME, FU_NAME])

        for (let i=0; i<temp.length; i++) {if (temp[i] == false) {temp[i] = Array(this.def[2][i]).fill(-1)}}

        if ((temp.length == 1) & (temp[0] == "default"))  {temp = Array(this.def[2][0]).fill(true)}   
        if (temp[0] & !day & this.tm[0]) {this.vp[this.def[1]["shift"]]="д"} 
        else {this.vp[this.def[1]["shift"]]="н"}
        if (temp[0] & day) {this.vp[this.def[1]["shift"]]="д"}

        if (this.def[0]["date"]) {this.vp[this.def[1]["date"]] = this.tm[1]} // дата   
        if (this.def[0]["time"]) {this.vp[this.def[1]["time"]] = this.tm[2]} // время 

        let seller = this.all_tables_sorted[0]["seller"].trim().split(" ").filter((e) => !e.includes("-")).join(" ")
        let seller_hash = btoa(unescape(encodeURIComponent(seller)))

        if (Object.keys((this.cfg["enames"])).includes(seller_hash)) seller = decodeURIComponent(escape(atob(this.cfg["enames"][seller_hash])))
        if (this.def[0]["name"]) {this.vp[this.def[1]["name"]] = seller} // имя продавца

    }

    standart(temp, otemp) {

        let FU_NAME = "standart"
        log("async function", `${FU_NAME}(${temp, otemp})`, [this.CLASS_NAME, FU_NAME])

        if (!this.uv_turn) {this.vp[this.all_list[this.traffic]]                    =  temp[1]} // ув (5 - 16)
        if (Object.keys(this.all_tables_sorted[2]).includes("636")) {this.vp[19]    =  temp[2]} // 636 проверка наличия
        if (this.uv_turn) {this.vp[21]                                              = otemp[0]} // учет заказов
        if (this.uv_turn) {this.vp[this.all_list[this.traffic]]                     = otemp[0]} // заказы 22-23 самовывоз приложение
    }

    enter_group(temp, otemp) {

        let FU_NAME = "enter_group"
        log("async function", `${FU_NAME}(${temp, otemp})`, [this.CLASS_NAME, FU_NAME])

        this.vp[3] = temp[0]  // вход 
        this.vp[4] = temp[3]  // не клиент 
        this.standart(temp, otemp)
    }

    items_group(temp) { // 3
        
        let FU_NAME = "items_group"
        log("async function", `${FU_NAME}(${temp})`, [this.CLASS_NAME, FU_NAME])

        let items = this.all_tables_sorted[2]

        if (Object.keys(items).length > 0) {

            let desc = []
            let arts = []
            let count = 0

            items.forEach(e => {
                if (temp[3] == 1) {
                    if (!(this.cfg["stop"].includes(e.art)) || (e.art == 0 & e.name == "Клиентский заказ")) {
                        desc.push(e.name); 
                        if (e.art != 0) {arts.push(e.art);}; 
                        if (e.is_good || e.name == "Клиентский заказ") {count+=Number(e.count);}
                    }
                } else if (temp[3] == -1) {
                    desc.push(e.name); arts.push(e.art); if (e.is_good || e.name == "Клиентский заказ") {count+=Number(e.count)};
                }
            }); 
            
            if (temp[1] != 1) {desc = []}

            let comment_245 = this.all_tables_sorted[0]["comment"].replace(/[\r\n\t]+/g, " ")
            let c = document.createElement("div")

            c.innerHTML += comment_245
            comment_245 = c.innerText

            if ((temp[4] == 1) & !(["Не задан", ""].includes(comment_245))) {
                desc.push(comment_245.replace(":", " "))
            }
            
            this.vp[26]  =  desc.join(",  ")
            this.vp[29]  =  arts.join(";  ") 

            this.refuse_count = true

            if (temp[2] == -1) {this.vp[29] = temp[2]}
            if (temp[0] != 1) { this.vp[27] = temp[0]; this.vp[28] = temp[0] } 

            else { 

                if (count > 0) { this.vp[27] = 1; this.vp[28] = count; this.refuse_count = true;
                } else { 

                    this.refuse_count = false; 

                    this.vp[27] = 0; this.vp[28] = 0 
                    this.vp[this.all_list[this.traffic]] = 0; this.vp[3] = 0;

                }
            }
        }
    }

    money_group(temp) {    
        
        let FU_NAME = "money_group"
        log("async function", `${FU_NAME}(${temp})`, [this.CLASS_NAME, FU_NAME])

        function cd(n) {
            let num = n.split(".")
            if (num[1] == "00") {return num[0]} 
            else { if (num[1][1] == "0") {num[1] = num[1][0]}; return num.join("."); }
        }

        let m = [Number(cd((this.all_tables_sorted[1]["cash"]))), 
                 Number(cd((this.all_tables_sorted[1]["no_cash"]))), 
                 Number(cd((this.all_tables_sorted[1]["sbp"])))]

        let cnc = [[m[0], m[1], m[2]], [m[0], m[1] + m[2]]]

        cnc.forEach(e => {e.forEach(elem => {
            if (elem == 0) {elem = -1}
        })});

        function isInteger(num) {
            return (num ^ 0) === num;
        }

        for (let i = 0; i < cnc.length; i++) {
            for (let j = 0; j < cnc[i].length; j++) {
                if (cnc[i][j] == 0 || !this.refuse_count) {cnc[i][j] = ["-1", "-1"]} 
                else {
                    if (!isInteger(cnc[i][j])) {
                        cnc[i][j] = [cnc[i][j].toString().trim().split(".").join(","), Math.round(cnc[i][j]).toString().trim()]
                    } else {
                        cnc[i][j] = [cnc[i][j].toString().trim(), cnc[i][j].toString().trim()]
                    }
                }
            }
        }
        
        let cash_nocash = cnc[1]
        let cash_nocash_sbp = cnc[0]

        this.money_object = ((temp.length == 1) & (temp[0] == -1)) ? { 37: ["-1", "-1"], 38: ["-1", "-1"] } : false

        // обычная оплата 
        if (temp[0] === 1 & !this.money_object) {
            this.vp[30] = cash_nocash_sbp[0][0]
            this.vp[31] = cash_nocash_sbp[1][0]
            this.vp[32] = cash_nocash_sbp[2][0]
            this.money_object = {
                30: cnc[0][0],
                31: cnc[0][1],
                32: cnc[0][2]
            }

        // оплата заказа
        } else if (temp[1] === 1) {
            this.vp[33] = cash_nocash[0][0]
            this.vp[34] = cash_nocash[1][0]
            this.money_object = {
                33: cnc[1][0],
                34: cnc[1][1]
            }

        // возврат заказа
        } else if (this.return_type != false & (temp[2] === 1)) {
            if (this.return_type.type[0] != false) {
                if (this.return_type.type[0] == "mobile") {
                    this.vp[33] = cash_nocash[0][0]
                    this.vp[34] = cash_nocash[1][0]
                    this.money_object = {
                        33: cnc[1][0],
                        34: cnc[1][1]
                    }
                } else if (this.return_type.type[0] == "buyer") {
                    this.vp[37] = cash_nocash[0][0]
                    this.vp[38] = cash_nocash[1][0]
                    this.money_object = {
                        37: cnc[1][0],
                        38: cnc[1][1]
                    }
                } else {
                    this.vp[37] = cash_nocash[0][0]
                    this.vp[38] = cash_nocash[1][0]
                    this.money_object = {
                        37: cnc[1][0],
                        38: cnc[1][1]
                    }
                }      
            }
        } 
    }

    Scan(temp) {

        let FU_NAME = "Scan"
        log("async function", `${FU_NAME}(${temp})`, [this.CLASS_NAME, FU_NAME])

        this.default_group(temp[0])
        this.enter_group(temp[1], temp[2])
        this.items_group(temp[3])
        this.money_group(temp[4])
        return this.vp

    } 
}
