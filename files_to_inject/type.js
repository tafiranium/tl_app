class Type {

    constructor(html, config, temp, back) {

        this.html       = html
        this.config     = config
        this.temp       = temp
        this.cluv       = {}
        this.back       = back

        this.vars = {traffic: [19, true], reasons: [20, true], comment: [21, true], shop: [1, true], return_link: [17, false]}
        for (let v in this.vars) {
            let temp = this.vars[v]
            this.vars[v] = this.html.querySelector(`#detail-view tr:nth-child(${(temp[1])?`${temp[0]}) td`:`${temp[0]}) td a`}`)
            this.vars[v] = (temp[1]) ? this.vars[v].innerText.trim(): (this.vars[v] == null) ? false: this.vars[v].getAttribute("href")
        }

        this.type = this.get_type()
    }

    one_check(name) {

        let item_table = this.html.querySelectorAll("#receipt-items .items.table tbody tr")
        let item_table_size = item_table.length
        
        if (item_table_size == 1) {
            let item_name = item_table[0].querySelector("td:nth-child(2)").innerText
            return (item_name === name)
        } return false
        
    }

    check(arg) {

        if (arg["type"] == 1) {return (Object.keys(arg["template"][arg["part"]][2]).includes(this.vars["traffic"]))}
        if (arg["type"] == 2) {return this.one_check(arg["argument"])}
        if (arg["type"] == 3) {return (!arg["return"])}

    } 

    get_type() {

        Object.keys(this.temp).forEach(element => {

            let cfg = this.temp[element][1]
            
            let send = {
                "type":       cfg[0], 
                "argument":   cfg[1], 
                "part":       element, 
                "template":   this.temp,
                "return":     this.back
            }   

            this.cluv[element] = this.check(send)

        }); this.cluv["empty"] = false
        
        let enter = this.config["enter"].includes(this.vars["traffic"])
        let dc = false

        let send = [enter, dc, this.config["points"][this.vars["shop"]]]

        let end_r = (el) => {if (this.cluv[el]) {return [el, send]} else return false}
        let all_temps =     Object.keys(this.temp)
        let no_buyer  =     this.config["no_buyer"]

        let result = false

        all_temps.filter(x => !no_buyer.includes(x)).forEach(x => {let s = end_r(x); if (s) {result = s}});
        no_buyer.forEach(x => {let s = end_r(x); if (s) {result = s}});

        if (!result) {result = "empty"}

        return result

    }
}
