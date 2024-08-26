
class Tables {
    constructor(settings) {

        this.cfg    =   settings
        this.sel     =   this.cfg["selectors"]["tables"]

        this.mbase  =  this.set_table("main")
        this.money  =  this.set_table("mone")
        this.sales  =  this.set_table("sale")
        this.items  =  this.set_table("item", true)
    
    }
    
    set_table(name, findall=false) { 
        if (findall) {return document.querySelectorAll(this.sel[name])} 
        else            {return document.querySelector(this.sel[name])}
    }

    get_all() {
        return [
            new Base (this.mbase, this.cfg), 
            new Money(this.money, this.cfg),  
            new Items(this.items, this.cfg)
        ]
    }
}

class Base {
    constructor(html, settings) {
        this.table =                 html
        this.cfg   =             settings
        this.det   =  this.cfg["details"]
        this.table_sorted = this.sorted()
    }

    detail_table(n, to, inner=true) {
        let body = this.table.querySelector(`tr:nth-child(${n}) ${to}`)
        if (inner) {return body.innerHTML}           else {return body} 
    }

    sorted() {
        let send = {}

        for (let key in this.det) {
            send[key] = this.detail_table(
                    this.det[key][0], 
                    this.det[key][1], 
                    this.det[key][2]
        )}; return send;
    }
}

class Money {
    constructor(html, settings) {
        this.table  =       html 
        this.cfg    =   settings
        this.temp   = {
            cash:    this.gtable(1), 
            no_cash: this.gtable(2), 
            sbp:     this.gtable(3) 
        }
    }

    gtable(n) {
        return parseFloat(this.table.querySelector(`tr:nth-child(${n}) td`
            ).innerHTML.replace(" ", "").replace("руб.", "")).toFixed(2)
    }

    get() {
        for (let key in this.temp) {
            if (this.temp[key]=="0") {
                this.temp[key]=-1
            }} return this.temp
    }
}

class Item {
    constructor() {
        this.is_good =  undefined
        this.name   =   undefined
        this.art    =   undefined
        this.count  =   undefined
    }
}


class Items {
    constructor(html_list, settings) {
        this.items_list =   html_list
        this.cfg        =    settings
        this.items      =          []
        this.loop()   
    }

    isNumeric(num) {return !isNaN(num)}

    loop(max_comment_size=27) {

        this.items_list.forEach((item) => {
            
            let obj = new Item()
            let all =                 item.querySelector("td:nth-child(2)").innerHTML 
            let art =                                  all.slice(0, all.indexOf(' '))
            obj.count = item.querySelector("td:nth-child(3)").innerHTML.split(".")[0]

            if (this.isNumeric(art)) {

                obj.name =           all.slice(all.indexOf(' '), all.length)  
                if (obj.name.length > max_comment_size) {obj.name = obj.name.slice(0, max_comment_size)}
                obj.art     =    art
                obj.is_good =   true

                this.items.push(obj)

            } else {

                obj.is_good = false
                obj.name    =   all
                obj.art     =   "0" 

                this.items.push(obj)

            }
        })
    }
}
