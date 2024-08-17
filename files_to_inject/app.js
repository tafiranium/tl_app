
// Лицензируемое программное обеспечение: Это лицензируемое программное обеспечение – 
// расширение для браузера, которое распространяется как на клиентскую, так и для серверную часть.
// Область действия лицензии: Эта лицензия распространяется на использование расширения для браузера на сайте VP.
// Оплата: Пользователь соглашается на разовую оплату фиксированной суммы за использование на одном магазине.
// Права: Пользователь получает право использовать расширение для браузера на одном магазине в соответствии с условиями лицензионного соглашения.
// Ограничения: Пользователь не имеет права распространять или воспроизводить расширение для браузера без согласия правообладателя.
// Ответственность: Ни при каких обстоятельствах правообладатель не несет ответственность за любые убытки или ущерб, прямой или косвенный, возникшие в результате использования или невозможности использования расширения для браузера.
// Срок действия: Данная лицензия действует бессрочно с момента оплаты пользователем фиксированной суммы.
// Заключительные положения: Принятие пользователем условий данного лицензионного соглашения означает его согласие с указанными условиями.
// Пользователь, скачав данное ПО автоматически дает согласие на принятие условий лицензионного соглашения. 
// Так как это корпоративное ПО все сотрудники были оповещенны и проинформированны.


class App {

    constructor(start_key, console=false) {
        this.start_key = start_key
        this.main()
        this.console = console
    }

    async get_file(salt, type=true) {
        let response  =                                 await fetch(window.atob(this.start_key) + salt);
        if (response.ok) {if (type) {return await response.json();} else {return await response.text();}
        } else                                          {console.log("Ошибка HTTP: " + response.status)}
    }

    clear() {if (!this.console) {console.clear()}}

    async main() {
        console.clear()
        this.cfg          =                             await this.get_file("settings.new")
        this.clear()
        this.int          =                                                 new Interface()
        this.clear()
        this.table        =                                            new Tables(this.cfg)
        this.clear()
        this.atb          =                                            this.table.get_all()
        this.clear()
        this.tdtm         = new VpTime(this.atb[0]["table_sorted"]["datetime"].split(", "))
        this.clear()
        this.analysis     =                  new AnalIs(this.atb, this.cfg, this.tdtm.tdtm)
        this.clear()
        this.type_of_page =                                      this.analysis.type_of_page
        this.clear()
        this.copy_class   =             new CopyConnect(this.analysis.vp, this.int.buttons, 
                                  this.type_of_page, this.int, this.atb[0]["table_sorted"])
        this.clear()
        this.start_key = "qrt234_432fdgdf3*ffgdgdfgfdf"
        this.clear()
    }
}

const TL_APP = new App('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3RhZmlyYW5pdW0vdGxfYXBwL21haW4v')
TL_APP.clear()

