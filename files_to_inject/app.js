let sets = {start_key: 'aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3RhZmlyYW5pdW0vdGxfYXBwL21haW4v', config: false}

class App {

    constructor(args) {
        this.CLASS_NAME = "App"
        this.config = args["config"] 
        this.html = document.body
        this.start_key = args["start_key"]
        this.main()
    }

    async get_file(salt, type=true) {

        let FU_NAME = "get_file"
        log("async function", `${FU_NAME}(${salt}, ${type})`, [this.CLASS_NAME, FU_NAME])

        let response  = await fetch(window.atob(this.start_key) + salt);
        if (response.ok) {
            if (type) {return await response.json()} 
            else {return await response.text()}
        } else {console.log("Ошибка HTTP: " + response.status)}
    }

    t(type_of_page) {return this.cfg["type_settings"][type_of_page][2]}

    async get_html() {

        let html = document.body
    
        if (window.location.href.includes("cpanel")) {
            let href = "" + window.location
            href = href.replace("/cpanel/console?path=", "")
            html = await get_page(href)
            let temp = document.createElement("div")
            temp.innerHTML += html
            html = temp
        }
    
        return html
    }
    

    async main() {

        this.html = await this.get_html()

        let FU_NAME = "main"
        log("async function", `${FU_NAME}()`, [this.CLASS_NAME, FU_NAME])

        this.cfg = await this.get_file("settings.new").catch(err => {console.log("[App.main] GET_CONFIG_ERROR", err)})
        log("config: ", this.cfg, [this.CLASS_NAME, FU_NAME])

        this.templates = {
            all_list: Object.assign({}, this.t("buyer"), this.t("market"), this.t("mobile"), this.t("takeup")),
            uv_off: Object.assign({}, this.t("market"), this.t("mobile"), this.t("takeup")),
            need: {traffic: ["open", "return"], comment: ["market", "mobile", "takeup", "return", "no_item"], reasons: ["no_item"]},
            icons: [["ฅ^•⩊•^ฅ", "⎛⎝^>⩊<^⎠⎞"], "≽/ᐠ - ˕ -マ≼"] }
        
        this.deny = ["Не задан", ""]

        this.interface = new Interface()
        this.buttons = await this.interface.run(this.html)

        log("this.buttons: ", this.buttons, [this.CLASS_NAME, FU_NAME])

        this.tables = new Tables(this.cfg, this.html)
        this.tables = await this.tables.get_all()

        this.all_tables_sorted = [this.tables[0], this.tables[1], this.tables[2]]

        console.log(this.all_tables_sorted)
        
        log("All sorted tables: ", this.all_tables_sorted, [this.CLASS_NAME, FU_NAME])

        this.traffic  = this.all_tables_sorted[0]["traffic"]
        this.comment  = this.all_tables_sorted[0]["comment"]
        this.reasons  = this.all_tables_sorted[0]["reason"]
        
        log("this.traffic: ", this.all_tables_sorted[0]["traffic"], [this.CLASS_NAME, FU_NAME])
        log("this.comment: ", this.all_tables_sorted[0]["comment"], [this.CLASS_NAME, FU_NAME])
        log("this.reasons: ", this.all_tables_sorted[0]["reason"], [this.CLASS_NAME, FU_NAME])

        this.datetime = new VpTime()
        this.datetime = await this.datetime.run(this.all_tables_sorted[0]["datetime"].split(", "))
        
        log("this.datetime: ", this.datetime, [this.CLASS_NAME, FU_NAME])

        this.analysis     = new AnalIs()
        this.analis       = await this.analysis.run({
            tables:     this.all_tables_sorted, 
            all_list:   this.templates["all_list"],
            config:     this.cfg,
            html:       this.html,
            interface:  this.interface,
            templates:  this.templates,
            datetime:   this.datetime,
            deny:       this.deny
        })

        log("this.analysis: ", this.analysis, [this.CLASS_NAME, FU_NAME])
        log("this.analis: ",   this.analis,   [this.CLASS_NAME, FU_NAME])

        this.uv_turn      = this.analysis.uv_turn 
        this.type_of_page = this.analis[0]

        log("this.uv_turn: ", this.uv_turn, [this.CLASS_NAME, FU_NAME])
        log("this.type_of_page: ", this.type_of_page, [this.CLASS_NAME, FU_NAME])

        this.copy_class = new CopyConnect()
        await this.copy_class.run({

            html:              this.html,
            type_of_page:      this.type_of_page,
            interface:         this.buttons,
            all_tables_sorted: this.all_tables_sorted[0]["table_sorted"],

            traffic:           this.traffic,
            comment:           this.comment,
            reasons:           this.reasons,

            analis:            this.analysis,
            deny:              this.deny,
            templates:         this.templates

        })

        log("this.copy_class: ", this.copy_class, [this.CLASS_NAME, FU_NAME])
    }
}

let application = false 

function reinstallClass() {
    application = new App(sets)
}

application = new App(sets)


