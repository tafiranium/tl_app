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

        let response  = await fetch(window.atob(this.start_key) + salt);
        if (response.ok) {
            if (type) {return await response.json()} 
            else {return await response.text()}
        } else {console.debug("Ошибка HTTP: " + response.status)}
    }

    t(type_of_page) {return this.cfg["type_settings"][type_of_page][2]}

    async get_html() {

        let html = document.body

        async function waitForIframeAndElement(selector) {
            return new Promise((resolve, reject) => {
                const checkIframe = setInterval(() => {
                    const iframe = document.querySelector('main iframe');
                    if (iframe) {
                        const checkElement = setInterval(() => {
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                            const element = iframeDocument.querySelector(selector);
                            if (element) {
                                clearInterval(checkElement);
                                clearInterval(checkIframe);
                                resolve(element);
                            }
                        }, 100);
                    }
                }, 100);
            });
        }
    
        if (window.location.href.includes("cpanel")) {
            html = await waitForIframeAndElement("#yw0")
        }

        return html
    }
    

    async main() {

        this.html = await this.get_html()
        this.cfg = await this.get_file("settings.new").catch(err => {console.log("[App.main] GET_CONFIG_ERROR", err)})

        this.templates = {
            all_list: Object.assign({}, this.t("buyer"), this.t("market"), this.t("mobile"), this.t("takeup")),
            uv_off: Object.assign({}, this.t("market"), this.t("mobile"), this.t("takeup")),
            need: {traffic: ["open", "return"], comment: ["market", "mobile", "takeup", "return", "no_item"], reasons: ["no_item"]},
            icons: [["ฅ^•⩊•^ฅ", "⎛⎝^>⩊<^⎠⎞"], "≽/ᐠ - ˕ -マ≼"] }
        
        this.deny = ["Не задан", ""]

        this.interface = new Interface()
        this.buttons = await this.interface.run(this.html)


        this.tables = new Tables(this.cfg, this.html)
        this.tables = await this.tables.get_all()

        this.all_tables_sorted = [this.tables[0], this.tables[1], this.tables[2]]
        let nc = new no_client({"config": this.cfg, "table": this.all_tables_sorted})
        await nc.connect(this.buttons[3])

        console.log(this.all_tables_sorted)

        this.traffic  = this.all_tables_sorted[0]["traffic"]
        this.comment  = this.all_tables_sorted[0]["comment"]
        this.reasons  = this.all_tables_sorted[0]["reason"]

        this.datetime = new VpTime()
        this.datetime = await this.datetime.run(this.all_tables_sorted[0]["datetime"].split(", "))

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


        this.uv_turn      = this.analysis.uv_turn 
        this.type_of_page = this.analis[0]


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
    }
}

let application = false 

function reinstallClass() {
    application = new App(sets)
}

application = new App(sets)

function trackUrlChanges() {
    let currentUrl = window.location.href;

    const observer = new MutationObserver(() => {
        if (currentUrl !== window.location.href) {

            let href = window.location.href
            if (currentUrl.includes("sales/view/id")) {application.interface.remove()}
            application = false 
            if (href.includes("sales/view/id")) {application = new App(sets)}
            
        }
    });

    // Наблюдаем за изменениями в документе
    observer.observe(document, { childList: true, subtree: true });
}

// Запускаем отслеживание
trackUrlChanges();

// Функция для отслеживания изменений URL
function trackUrlChanges() {
    let currentUrl = window.location.href;

    // Наблюдение за изменениями в документе
    const observer = new MutationObserver(() => {

        let href = window.location.href

        if (currentUrl !== href) {

            if (!href.includes("sales/view/id")) {application.interface.remove()} 
            else {{console.clear(); application = new App(sets)}}

            currentUrl = href

        }
    });

    observer.observe(document, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", function() {
    trackUrlChanges();
});
