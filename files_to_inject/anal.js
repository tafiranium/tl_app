class AnalIs {
    constructor(args) {

        this.ready = true
        
        this.all_tables_sorted = args["tables"]
        this.traffic           = this.all_tables_sorted[0]["traffic"]
        this.cfg               = args["config"]
        this.buttons           = args["buttons"]
        this.temp              = this.cfg["type_settings"] 
        this.html              = args["html"]
        this.scanr             = args["scanr"]
        this.temps             = args["templates"]
        this.all_list          = args["templates"]["all_list"]
        this.deny              = args["deny"]
        this.tor               = false
        

        if (this.scanr)  {

            this.uv_turn = Object.keys(this.temps["uv_off"]).includes(this.traffic) 
            if (this.deny.includes(this.traffic)) {this.ready = this.PromptRedirect();  console.log("traffic-deny");}
            this.type_of_page = this.TypeOfPage()

        } else {

            this.vp  =  Array(this.cfg["main"]["size"]).fill(-1)
            this.def =  this.cfg["default"]
            this.tm  =  args["datetime"].tdtm
            this.ts  =  {}

            Object.keys(this.temp).forEach(element => {this.ts["t" + element.replace("_", "")] = this.temp[element]});
    
            this.type_of_page = this.TypeOfPage()
            this.add_page     = false
    
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
        if (this.def[0]["name"]) {this.vp[this.def[1]["name"]] = this.all_tables_sorted[0]["seller"]}   // имя продавца

    }

    standart(temp, otemp) {
        if (!this.uv_turn) {this.vp[this.all_list[this.traffic]]                    =  temp[1]} // ув (5 - 16)
        if (Object.keys(this.all_tables_sorted[2]).includes("636")) {this.vp[19]    =  temp[2]} // 636 проверка наличия
        if (this.uv_turn) {this.vp[21]                                              = otemp[0]} // учет заказов
        if (this.uv_turn) {this.vp[this.all_list[this.traffic]]                     = otemp[0]} // заказы 22-23 самовывоз приложение
    }

    enter_group(temp, otemp, type_of_return) {

        this.vp[3] = temp[0]  // вход 
        this.vp[4] = temp[3]  // не клиент 

        if (this.type_of_page[0] == "return" & this.ready) {
            if (!type_of_return.uv_turn) {this.vp[this.all_list[type_of_return.traffic]] =  0}  // ув (5 - 16)
            if (type_of_return.uv_turn) {this.vp[21]                                     =  0}  // учет заказов
            if (type_of_return.uv_turn) {this.vp[this.all_list[type_of_return.traffic]]  =  0}  // заказы 22-23 самовывоз приложение            
        } else {this.standart(temp, otemp)}
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
            comment_245 = c.innerText

            if ((temp[4] == 1) & !(["Не задан", ""].includes(comment_245))) {
                desc.push(comment_245.replace(":", " "))
            }
            
            this.vp[26]  =  desc.join(",  ")
            this.vp[29]  =  arts.join(";  ") 
            if (temp[2] == -1) {this.vp[29] = temp[2]}
            if (temp[0] != 1) { this.vp[27] = temp[0]; this.vp[28] = temp[0] } 
            else { this.vp[27] = 1; this.vp[28] = count; }
        }
    }

    async money_group(temp, type_of_return) {    
        
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

        if ((this.type_of_page[0] == "return") & (type_of_return != false)) {
                
                if (type_of_return.ready) {
                    if (type_of_return.type_of_page[0] == "mobile") {

                        if (cash_nocash[0] != "-1") {this.vp[33] = "-"+cash_nocash[0]}   
                        if (cash_nocash[1] != "-1") {this.vp[34] = "-"+cash_nocash[1]}
    
                    } else if (type_of_return.type_of_page[0] == "market") {
                        console.log("market return")
                    } else if (type_of_return.type_of_page[0] == "buyer" || this.deny.includes(type_of_return.traffic)) {
    
                        this.vp[37] = cash_nocash[0]
                        this.vp[38] = cash_nocash[1]
    
                    } 
                } else {
                    this.vp[37] = cash_nocash[0]
                    this.vp[38] = cash_nocash[1]
                } 

            } else {

            // обычная оплата 
            if (temp[0] === 1) {
                this.vp[30] = cash_nocash_sbp[0]
                this.vp[31] = cash_nocash_sbp[1]
                this.vp[32] = cash_nocash_sbp[2]

            // оплата заказа
            } else if (temp[1] === 1) {
                this.vp[33] = cash_nocash[0]
                this.vp[34] = cash_nocash[1]
            }
        }
    }

    async Scan(temp) {

        this.tor = await this.tor_injector()
        
        this.default_group(temp[0])
        this.enter_group(temp[1], this.current_temp[2], this.tor)
        this.items_group(temp[3])
        await this.money_group(temp[4], this.tor)
        return this.vp
    } 

    async get_tor() {
        if (this.type_of_page[0] === "return") {
            let url = "https://" + window.location.host + this.html.querySelector(".detail-view tr:nth-child(17) a").getAttribute("href")
            if (url) {
                let result = false
                let r = await get_page(url).then(r => result = r);
                return result
            }
        } 
        return false;
    }

    PromptRedirect() {
        let result = confirm("Исходный чек заполнен не верно, перейти к проблемному чеку?");
        if (result) {window.location.replace(this.scanr)} else {return false}
    }

    TypeOfPage() {

        console.log(this.all_tables_sorted)

        function one_check(name, ats) {
            let siz = Object.keys(ats[2]).length
            if (siz <= 1) {if (ats[2][0].name === name) {return true}}
            return false
        }

        function check(type, arg, add, ats, temp) {
            // console.log(add, temp[add][2], ats[0]["traffic"])
            if (type == 1) {return (temp[add][2][ats[0]["traffic"]]  != undefined)}
            if (type == 2)               {return one_check(arg, ats)}
            console.log(arg)
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
        console.log(result)
        return result
    }

    async tor_injector() {
        this.tor = await this.get_tor()
        if (this.tor) {
            let relement = document.createElement("div") 
            relement.innerHTML = this.tor
            relement.querySelector(".main-content")
            let tp = this.cfg["type_settings"]
            let check_if_comment = Object.assign({}, tp["market"][2], tp["mobile"][2], tp["takeup"][2])

            this.add_page = new App({
                start_key: "aHRfdsfJdfd3242_Dfss", html: relement, 
                scanr: "https://" + window.location.host + this.html.querySelector(".detail-view tr:nth-child(17) a").getAttribute("href"), 
                config: this.cfg}
            )

            console.log(this.add_page)

            this.add_page_type = this.add_page.type_of_page
            console.log("----MAIN----")
            
            this.scanr = this.add_page.scanr
            
            if (this.add_page.traffic in check_if_comment) {
                if (this.deny.includes(this.add_page.comment.trim())) {ready_comment = this.PromptRedirect();  console.log("comment-deny")}  
            }

            return this.add_page
        }
        return false
    }
}

