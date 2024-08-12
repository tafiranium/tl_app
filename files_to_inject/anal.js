class AnalIs {
    constructor(tables, config, tm) {
        
        this.settings          =       config
        this.all_tables_sorted =       [tables[0]["table_sorted"], tables[1]["temp"], tables[2]["items"]]
    
        this.vp                =       Array(this.settings["main"]["size"]).fill(-1)
        this.end_time_to_send = tm
        this.traffic           =       this.all_tables_sorted[0]["traffic"]

        this.temp              =       this.settings["type_settings"] 
        this.ts                =       {}
        this.def                =       this.settings["default"]

        Object.keys(this.temp).forEach(element => {this.ts["t" + element.replace("_", "")] = this.temp[element]});
        this.type_of_page = this.TypeOfPage()
        this.current_temp = this.temp[this.type_of_page[0]][0]
        for (let i=1; i<this.current_temp.length; i++) {
            let e = this.current_temp[i]
            if (e.length == 1 & e[0] == false) {
                this.current_temp[i] = Array(this.def[2][i]).fill(-1)
            }
        }
        this.tm = tm
        this.all_list = Object.assign({}, 
            this.settings["type_settings"]["buyer"][2], 
            this.settings["type_settings"]["market"][2], 
            this.settings["type_settings"]["mobile"][2], 
            this.settings["type_settings"]["takeup"][2]
        )

        this.uv_off = Object.assign({}, 
            this.settings["type_settings"]["market"][2], 
            this.settings["type_settings"]["mobile"][2], 
            this.settings["type_settings"]["takeup"][2]
        )

        this.uv_turn = Object.keys(this.uv_off).includes(this.traffic) 
        console.log(this.uv_off, this.settings["type_settings"]["buyer"])
        this.Scan()
    }


    default_group(temp) {

        
        let day  = this.type_of_page[1][2]

        for (let i=0; i<temp.length; i++) {if (temp[i] == false) {temp[i] = Array(this.def[2][i]).fill(-1)}}

        if ((temp.length == 1) & (temp[0] == "default"))  {temp = Array(this.def[2][0]).fill(true)}   
        if (temp[0] & !day & this.tm[0]) {this.vp[this.def[1]["shift"]]="д"} else {this.vp[this.def[1]["shift"]]="н"}
        if (temp[0] & day)               {this.vp[this.def[1]["shift"]]="д"}

        if (this.def[0]["date"]) {this.vp[this.def[1]["date"]]            = this.end_time_to_send[1]}   // дата   
        if (this.def[0]["time"]) {this.vp[this.def[1]["time"]]            = this.end_time_to_send[2]}   // время 
        if (this.def[0]["name"]) {this.vp[this.def[1]["name"]] = this.all_tables_sorted[0]["seller"]}   // имя продавца

    }

    enter_group(temp, otemp) {

        this.vp[3] = temp[0]  // вход 
        this.vp[4] = temp[3]  // не клиент 
        
        if (!this.uv_turn) {this.vp[this.all_list[this.traffic]]                         = temp[1]}           // ув (5 - 16)
        if (Object.keys(this.all_tables_sorted[2]).includes("636")) {this.vp[19]  =  temp[2]}               // 636 проверка наличия
        if (this.uv_turn) {this.vp[21]                                              = otemp[0]}               // учет заказов
        if (this.uv_turn) {this.vp[this.all_list[this.traffic]]                     = otemp[0]}               // заказы 22-23 самовывоз приложение

    }

    items_group(temp) {
        console.log(temp)
        let items = this.all_tables_sorted[2]
        if (Object.keys(items).length > 0) {
            let desc = []
            let arts = []
            let count = 0

            items.forEach(e => {
                if (e.is_good) {count+=Number(e.count)}
                if (temp[3] == 1) {if (!(this.settings["stop"].includes(e.art))) {desc.push(e.name); arts.push(e.art)}} 
                else {desc.push(e.name); arts.push(e.art)}
            }); 
            
            if (temp[1] != 1) {desc = []}
            let comment_245 = this.all_tables_sorted[0]["comment"]
            let c = document.createElement("div")
            c.innerHTML += comment_245
            comment_245 = c.innerText

            if ((temp[4] == 1) & !(["Не задан", ""].includes(comment_245))) {
                desc.push(comment_245.replace(":", " "))
            }

            console.log(desc, (temp[4] == 1), !(["Не задан", ""].includes(comment_245)))
            
            this.vp[26] =  desc.join(",  ")
            this.vp[29] = arts.join(";  ") 
            if (temp[2] == -1) {this.vp[29] = temp[2]}
            if (temp[0] != 1) { this.vp[27] = temp[0]; this.vp[28] = temp[0] } 
            else { this.vp[27] = 1; this.vp[28] = count; }
        }
    }

    money_group(temp) {
        console.log(temp)
        function cd(n) {
            let num = n.split(".")
            if (num[1] == "00") {return num[0]} 
            else { if (num[1][1] == "0") {num[1] = num[1][0]}; return num.join("."); }
        }

        let m = [Number(cd((this.all_tables_sorted[1]["cash"]))), 
                 Number(cd((this.all_tables_sorted[1]["no_cash"]))), 
                 Number(cd((this.all_tables_sorted[1]["sbp"])))]

        let cnc = [[m[0], m[1], m[2]], [m[0], m[1] + m[2]]]
        cnc.forEach(e => {e.forEach(elem => {if (elem == 0) {elem = -1}});});
        for (let i = 0; i < cnc.length; i++) {for (let j = 0; j < cnc[i].length; j++) {if (cnc[i][j] == 0) cnc[i][j] = -1}}

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

        // возврат денег
        } else if (temp[2] === 1) {
            this.vp[37] = cash_nocash[0]
            this.vp[38] = cash_nocash[1]
        }
    }

    Scan() {
        this.default_group(this.current_temp[0])
        this.enter_group(this.current_temp[1], this.current_temp[2])
        this.items_group(this.current_temp[3])
        this.money_group(this.current_temp[4])
        return this.vp
    } 


    TypeOfPage() {
        function one_check(name, ats) {
            let siz = Object.keys(ats[2]).length
            if (siz <= 1) {if (ats[2][0].name === name) {return true}}
            return false
        }

        function check(type, arg, add, ats, temp) {
            // console.log(add, temp[add][2], ats[0]["traffic"])
            if (type == 1) {return (temp[add][2][ats[0]["traffic"]]  != undefined)}
            if (type == 2)               {return one_check(arg, ats)}
            if (type == 3)               {return (ats[arg[0]][arg[1]]
                    .classList.contains(arg[2]) != true)}
        } 
        // console.log(this.all_tables_sorted, this.temp)
        let cluv = {} 
        Object.keys(this.temp).forEach(element => {
            let cfg = this.temp[element][1]
            cluv[element] = check(cfg[0], cfg[1], element, 
                this.all_tables_sorted, this.temp)
        }); cluv["empty"] = false

        let t = this.all_tables_sorted[0]
        let enter = this.settings["enter"].includes(t["traffic"])
        let dc = !!((t["dc"] != "Не задан")&(t["buyer"] != "Не задан"))
    
        let send = [enter, dc, this.settings["points"][this.all_tables_sorted[0]["shop"]]]

        let end_r = (el) => {if (cluv[el]) {return [el, send]} else return false}
        let all_temps =     Object.keys(this.temp)
        let no_buyer  =  this.settings["no_buyer"]

        let result = false

        all_temps.filter(x => !no_buyer.includes(x)).forEach(x => {let s = end_r(x); if (s) {result = s}});
        no_buyer.forEach(x => {let s = end_r(x); if (s) {result = s}});

        if (!result) {result = "empty"}
        return result
    }
}

