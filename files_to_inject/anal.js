class AnalIs {
    constructor(args) {

        this.ready = true
        
        this.all_tables_sorted = args["tables"]
        this.traffic           = this.all_tables_sorted[0]["traffic"]
        this.cfg               = args["config"]
        this.buttons           = args["buttons"]
        this.temp              = this.cfg["type_settings"] 
        this.html              = args["html"]
        this.temps             = args["templates"]
        this.all_list          = args["templates"]["all_list"]
        this.deny              = args["deny"]

        this.vp  =  Array(this.cfg["main"]["size"]).fill(-1)
        this.def =  this.cfg["default"]
        this.tm  =  args["datetime"].tdtm
        this.ts  =  {}
        this.refuse_count = false

        Object.keys(this.temp).forEach(element => {this.ts["t" + element.replace("_", "")] = this.temp[element]});

        this.type_of_page = this.TypeOfPage()
        this.current_temp = this.temp[this.type_of_page[0]][0]

        for (let i=1; i<this.current_temp.length; i++) {
            let e = this.current_temp[i]
            if (e.length == 1 & e[0] == false) {
                this.current_temp[i] = Array(this.def[2][i]).fill(-1)
            }
        }

        this.uv_turn = Object.keys(this.temps["uv_off"]).includes(this.traffic) 
        this.Scan(this.current_temp) 
        
    }

    default_group(temp) {
        
        let day  = this.type_of_page[1][2]
        for (let i=0; i<temp.length; i++) {if (temp[i] == false) {temp[i] = Array(this.def[2][i]).fill(-1)}}

        if ((temp.length == 1) & (temp[0] == "default"))  {temp = Array(this.def[2][0]).fill(true)}   
        if (temp[0] & !day & this.tm[0]) 
            {this.vp[this.def[1]["shift"]]="д"} 
        else 
        {this.vp[this.def[1]["shift"]]="н"}
        if (temp[0] & day)               {this.vp[this.def[1]["shift"]]="д"}

        if (this.def[0]["date"]) {this.vp[this.def[1]["date"]]            = this.tm[1]}   // дата   
        if (this.def[0]["time"]) {this.vp[this.def[1]["time"]]            = this.tm[2]}   // время 
        let seller = this.all_tables_sorted[0]["seller"].trim().split(" ").filter((e) => !e.includes("-")).join(" ")
        let seller_hash = btoa(unescape(encodeURIComponent(seller)))
        if (Object.keys((this.cfg["enames"])).includes(seller_hash)) seller = decodeURIComponent(escape(atob(this.cfg["enames"][seller_hash])))
        if (this.def[0]["name"]) {this.vp[this.def[1]["name"]] = seller}   // имя продавца

    }

    standart(temp, otemp) {
        if (!this.uv_turn) {this.vp[this.all_list[this.traffic]]                    =  temp[1]} // ув (5 - 16)
        if (Object.keys(this.all_tables_sorted[2]).includes("636")) {this.vp[19]    =  temp[2]} // 636 проверка наличия
        if (this.uv_turn) {this.vp[21]                                              = otemp[0]} // учет заказов
        if (this.uv_turn) {this.vp[this.all_list[this.traffic]]                     = otemp[0]} // заказы 22-23 самовывоз приложение
    }

    enter_group(temp, otemp) {

        this.vp[3] = temp[0]  // вход 
        this.vp[4] = temp[3]  // не клиент 
        this.standart(temp, otemp)
    }

    items_group(temp) {
        console.log(temp)
        let items = this.all_tables_sorted[2]
        if (Object.keys(items).length > 0) {

            let desc = []
            let arts = []
            let count = 0

            items.forEach(e => {
                
                if (temp[3] == 1) {
                    if (!(this.cfg["stop"].includes(e.art))) {
                        desc.push(e.name); arts.push(e.art); if (e.is_good) {count+=Number(e.count);}
                    }
                } 

                else {desc.push(e.name); arts.push(e.art); if (e.is_good) {count+=Number(e.count)};}
            }); 
            
            if (temp[1] != 1) {desc = []}
            let comment_245 = this.all_tables_sorted[0]["comment"]
            let c = document.createElement("div")
            c.innerHTML += comment_245
            comment_245 = c.innerText.replace(/[\r\n\t]+/g, " ")

            if ((temp[4] == 1) & !(["Не задан", ""].includes(comment_245))) {
                desc.push(comment_245.replace(":", " "))
            }
            
            this.vp[26]  =  desc.join(",  ")
            this.vp[29]  =  arts.join(";  ") 

            console.log(temp[2], temp[0])

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

    async money_group(temp) {    
        
        function cd(n) {
            let num = n.split(".")
            if (num[1] == "00") {return num[0]} 
            else { if (num[1][1] == "0") {num[1] = num[1][0]}; return num.join("."); }
        }

        let m = [Number(cd((this.all_tables_sorted[1]["cash"]))), 
                 Number(cd((this.all_tables_sorted[1]["no_cash"]))), 
                 Number(cd((this.all_tables_sorted[1]["sbp"])))]

        let cnc = [[m[0], m[1], m[2]], [m[0], m[1] + m[2]]]
        cnc.forEach(e => {e.forEach(elem => {if (elem == 0) {elem = -1}})});
        for (let i = 0; i < cnc.length; i++) {for (let j = 0; j < cnc[i].length; j++) {if (cnc[i][j] == 0 || !this.refuse_count) {cnc[i][j] = -1} else {cnc[i][j] = cnc[i][j].toString().trim().split(".").join(",")}}}

        let cash_nocash = cnc[1]
        let cash_nocash_sbp = cnc[0]

        // обычная оплата 
        if (temp[0] === 1) {
            this.vp[30] = cash_nocash_sbp[0]
            this.vp[31] = cash_nocash_sbp[1]
            this.vp[32] = cash_nocash_sbp[2]

        // оплата заказа
        } else if (temp[1] === 1) {
            this.vp[33] = cash_nocash[0]
            this.vp[34] = cash_nocash[1]

        // возврат заказа
        } else if (temp[2] === 1) {
            this.vp[37] = cash_nocash[0]
            this.vp[38] = cash_nocash[1]
        }
    }

    async Scan(temp) {
        this.default_group(temp[0])
        this.enter_group(temp[1], this.current_temp[2])
        this.items_group(temp[3])
        await this.money_group(temp[4])
        return this.vp
    } 

    TypeOfPage() {

        function one_check(name, ats) {
            let siz = Object.keys(ats[2]).length
            if (siz <= 1) {if (ats[2][0].name === name) {return true}}
            return false
        }

        function check(arg) {
            if (arg["type"] == 1) {return (Object.keys(arg["template"][arg["part"]][2]).includes(arg["all_tables"][0]["traffic"]))}
            if (arg["type"] == 2) {return one_check(arg["argument"], arg["all_tables"])}
            if (arg["type"] == 3) {return (arg["all_tables"][arg["argument"][0]][arg["argument"][1]]
                    .classList.contains(arg["argument"][2]) != true)}
        } 

        let cluv = {} 

        Object.keys(this.temp).forEach(element => {

            let cfg = this.temp[element][1]

            let send = {
                "type": cfg[0], 
                "argument": cfg[1], 
                "part": element, 
                "all_tables": this.all_tables_sorted, 
                "template": this.temp
            }

            cluv[element] = check(send)

        }); cluv["empty"] = false
        
        let t = this.all_tables_sorted[0]
        let enter = this.cfg["enter"].includes(t["traffic"])
        let dc = !!((t["dc"] != "Не задан") & (t["buyer"] != "Не задан"))
    
        let send = [enter, dc, this.cfg["points"][this.all_tables_sorted[0]["shop"]]]

        let end_r = (el) => {if (cluv[el]) {return [el, send]} else return false}
        let all_temps =     Object.keys(this.temp)
        let no_buyer  =     this.cfg["no_buyer"]

        let result = false

        all_temps.filter(x => !no_buyer.includes(x)).forEach(x => {let s = end_r(x); if (s) {result = s}});
        no_buyer.forEach(x => {let s = end_r(x); if (s) {result = s}});

        if (!result) {result = "empty"}
        return result
    }
}
