async function get_config(salt, type=true) {
    let key = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3RhZmlyYW5pdW0vdGxfYXBwL21haW4v"
    let response = await fetch(window.atob(key) + salt);
    if (response.ok) {
        if (type) {return await response.json();} else {return await response.text();}
    } else {
        console.log("Ошибка HTTP: " + response.status);
    }
}

class Tables {

    construct(tables_settings) {
        main()
    }

    async function main() {
        this.cfg = tables_settings
        this.tables = await allTables()
        this.formatted = [
            await this.GetDetails(), 
            await this.GetMoneyDetails(), 
            await this.GetItemTable()
        ]
    }
    
    async allTables() {
        const ttemp = await get_config("tt")
        function st(n) {return document.querySelector(this.cfg["sel"][n])}
        return [st(0), st(1), st(3)] 
    }

    async GetDetails() {

        function detail_table(n, to, inner=true) {
            if (inner) {return table_detail_view.querySelector(`tr:nth-child(${n}) ${to}`).innerHTML} 
            else {return table_detail_view.querySelector(`tr:nth-child(${n}) ${to}`)} 
        }

        send = {}
        let details = this.cfg["details"]
        for (key in details) {
            let d = details[key]
            send[key] = detail_table(d[0], d[1], d[2])
            console.log(detail_table(d[0], d[1], d[3]), d[0], d[1], d[2])
        }

        return send
    }

    async function GetMoneyDetails() {

        function money_table(n) {
            return table_price_detail_view.querySelector(`tr:nth-child(${n}) td`
                ).innerHTML.replace(" ", "").replace("руб.", "").split(".")[0]
        }
        
        for (let key in {cash: money_table(1), no_cash: money_table(2), sbp: money_table(3)}) {
            if (temp[key]=="0") {
                temp[key]=-1
            }
        } 

        return temp
    } 

    async function GetItemTable() {

        console.log("Function: GetItemTable() is started!")

        let send = {}     

        all_items.forEach((item) => {
            
            function isNumeric(num) {return !isNaN(num)}
            let all = item.querySelector("td:nth-child(2)").innerHTML 
            let art = all.slice(0, all.indexOf(' ')) // артикул

            if (isNumeric(art)) {

                let name = all.slice(all.indexOf(' '), all.length)  // описание
                if (name.length > 27) {name = name.slice(0, 27)}
                let count = item.querySelector("td:nth-child(3)").innerHTML.split(".")[0] 
                send[art] = {"desc": name, "count": count}

            } else {

                let name = all
                let count = item.querySelector("td:nth-child(3)").innerHTML.split(".")[0] 
                send[0] = {"desc": name, "count": count}

            }
        })

        return send
    }
}

class App {
    construct() {
        this.settings = await get_config("settings.json")
        this.tables = await Tables(this.settings["tables"])
    }
}

window.onload(async () => {
    const app = new App()
})