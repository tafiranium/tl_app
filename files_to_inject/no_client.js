class no_client {
    constructor(args) {
        this.args = args
        this.cfg = args["config"]
        this.table = args["table"]
        this.shop = this.table[0]["shop"]
        this.day = this.cfg["points"][this.shop]

    }

    async connect(button) {
        button.addEventListener("click", async () => {
            await this.fu({
                "config":   this.args["config"], 
                "table":    this.args["table"], 
                "day":      this.args["config"]["points"][this.args["table"][0]["shop"]]
            })
        })
    }

    format_uv(table) { return table.map((e) => ((e == -1) ? "" : e)).join("\t") }

    async fu(args) {

        let cfg     = args["config"]
        let table   = args["table"]
        let day     = args["day"]

        let problem = prompt("Что случилось?");

        if (problem) {

            problem = problem.replace(/[\r\n\t]+/g, " ").replace("  ", " ")

            let vp = Array(cfg["main"]["size"]).fill(-1)
            let def = cfg["default"]
            let temp = "default"
            let tm = await this.get_now()

            vp[26] = problem

            for (let i=0; i<temp.length; i++) {if (temp[i] == false) {temp[i] = Array(def[2][i]).fill(-1)}}
            if (temp == "default")  {temp = Array(def[2][0]).fill(true)}  
            if (temp[0] & !day & tm[0]) {vp[def[1]["shift"]]="д"} else {vp[def[1]["shift"]]="н"}
            if (temp[0] & day) {vp[def[1]["shift"]]="д"}

            if (def[0]["date"]) {vp[def[1]["date"]] = tm[1]} // дата   
            if (def[0]["time"]) {vp[def[1]["time"]] = tm[2]} // время 
            vp[4] = 0

            let seller = table[0]["seller"].trim().split(" ").filter((e) => !e.includes("-")).join(" ")
            let seller_hash = btoa(unescape(encodeURIComponent(seller)))

            if (Object.keys((cfg["enames"])).includes(seller_hash)) seller = decodeURIComponent(escape(atob(cfg["enames"][seller_hash])))
            if (def[0]["name"]) {vp[def[1]["name"]] = seller} // имя продавца

            navigator.clipboard.writeText(this.format_uv(vp))
                .then(() => {alert(`Успешно скопировано! (Не клиент)`)})
                .catch(err => {
                    console.log("Ошибка", err)
                    navigator.clipboard.writeText(this.format_uv(vp))
                        .then(() => {alert(`Успешно скопировано! (Не клиент)`)})
                        .catch(err => {
                            console.log("Ошибка", err)
                        }); 
                }); 
        } 
    }

    async get_now() {

        function two(number) {
            let n = number.toString().split("")
            if (n.length == 1) {return "0"+n[0]} else {return number.toString()}
        }



        let now = new Date();

        let time_obj = [
            `${two(now.getDate())}.${two(now.getMonth()+1)}.${now.getFullYear()}`, 
            `${now.getHours()}:${two(now.getMinutes())}:${two(now.getSeconds())}`
        ]

        let datetime = new VpTime()
        datetime = await datetime.run(time_obj)

        return datetime
    }
}
