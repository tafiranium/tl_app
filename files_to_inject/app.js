

let test_script = document.createElement("script")

test_script.src = "https://raw.githubusercontent.com/tafiranium/point_of_love/main/test.js"

test_script.type="text/javascript"

test_script.defer = true



document.head.appendChild(test_script)





// Лицензируемое программное обеспечение: Это лицензируемое программное обеспечение – расширение для браузера, которое распространяется как на клиентскую, так и для серверную часть.

// Область действия лицензии: Эта лицензия распространяется на использование расширения для браузера на сайте VP.

// Оплата: Пользователь соглашается на разовую оплату фиксированной суммы за использование на одном магазине.

// Права: Пользователь получает право использовать расширение для браузера на одном магазине в соответствии с условиями лицензионного соглашения.

// Ограничения: Пользователь не имеет права распространять или воспроизводить расширение для браузера без согласия правообладателя.

// Ответственность: Ни при каких обстоятельствах правообладатель не несет ответственность за любые убытки или ущерб, прямой или косвенный, возникшие в результате использования или невозможности использования расширения для браузера.

// Срок действия: Данная лицензия действует бессрочно с момента оплаты пользователем фиксированной суммы.

// Заключительные положения: Принятие пользователем условий данного лицензионного соглашения означает его согласие с указанными условиями.

// Пользователь, скачав данное ПО автоматически дает согласие на принятие условий лицензионного соглашения. 

// Так как это корпоративное ПО все сотрудники были оповещенны и проинформированны.



async function get_config(salt, type=true) {

    let key = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3RhZmlyYW5pdW0vdGxfYXBwL21haW4v"

    let response = await fetch(window.atob(key) + salt);

    if (response.ok) {

        if (type) {return await response.json();} else {return await response.text();}

    } else {

        console.log("Ошибка HTTP: " + response.status);

    }

}

async function GetTables(settings) {



    const t = await settings["tables"]



    function st(n, all=false) {

        if (all) {return document.querySelectorAll(t["sel"][n])} 

        else     {return document.querySelector(t["sel"][n])}

    }



    let table_detail_view =       st(0)

    let table_price_detail_view = st(1)

    let all_items =         st(2, true)



    async function GetDetails() {



        async function detail_table(n, to, inner=true) {

            let body = await table_detail_view.querySelector(`tr:nth-child(${n}) ${to}`)

            if (inner) {return body.innerHTML} else {return body} 

        }



        send = {}



        let details = t["details"]

        for (key in details) {

            let d = details[key]

            send[key] = await detail_table(d[0], d[1], d[2])

        }

        return await send

    }



    // получение деталей об получение оплаты (нал безнал сбп)

    function GetMoneyDetails() {



        function money_table(n) {

            return parseFloat(table_price_detail_view.querySelector(`tr:nth-child(${n}) td`

                ).innerHTML.replace(" ", "").replace("руб.", "")).toFixed(2)

        }



        let temp = {cash: money_table(1), no_cash: money_table(2), sbp: money_table(3) }

        // если нет определенного типа оплаты то -1 (пустота)

        for (let key in temp) {

            if (temp[key]=="0") {

                temp[key]=-1

            }

        } return temp

    }



    // получение таблицы с товарами

    function GetItemTable() {



        let send = {}     



        all_items.forEach((item) => {

            

            function isNumeric(num) {return !isNaN(num)}

            let all = item.querySelector("td:nth-child(2)").innerHTML 

            let art = all.slice(0, all.indexOf(' '))       // артикул



            if (isNumeric(art)) {



                let name = all.slice(all.indexOf(' '), all.length)  

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

    } return [await GetDetails(), await GetMoneyDetails(), await GetItemTable()];

}



async function check_list_uv_234(traffic, template, all_tables_sorted, settings) {

    let t = settings["type_of_page"]



    function one_check(name) {

        let siz = Object.keys(all_tables_sorted[2]).length

        if (siz <= 1) {

            if (all_tables_sorted[2][0] != undefined)

                if (all_tables_sorted[2][0]["desc"] === name) {

                    return true

                }

        }

        else return false

    }



    let check_list_uv = {

        "buyer":    (t["buyer"][1][traffic]  != undefined),

        "market":   (t["market"][1][traffic] != undefined),

        "shop":     (t["shop"][1][traffic]   != undefined),

        "takeup":   (t["shop"][1][traffic]   != undefined),

        "open":     one_check("открытие смены"),

        "return":   (all_tables_sorted[0]["return"].classList.contains("cssDisplayNone") != true),

        "no_item":  one_check("Нетовар"),

        "enter": (settings["enter"].includes(traffic)),

        "dc": !!((all_tables_sorted[0]["dc"] != "Не задан") & (all_tables_sorted[0]["buyer"] != "Не задан") &

                (all_tables_sorted[0]["dc"] != "") & (all_tables_sorted[0]["buyer"] != ""))

    }



    if (check_list_uv["open"] == true) {check_list_uv["open"] = (await all_tables_sorted[2][0]['desc'] == "открытие смены")}

    let send = [check_list_uv["enter"], check_list_uv["dc"], settings["points"][all_tables_sorted[0]["shop"]]]

    if (check_list_uv["return"])     {return ["return", send];} else {

        if      (check_list_uv["open"])     {return ["open", send]   }

        if      (check_list_uv["no_item"])  {return ["no_item", send]}

        else if (check_list_uv["buyer"])    {return ["buyer", send]  }

        else if (check_list_uv["market"])   {return ["market", send] }

        else if (check_list_uv["shop"])     {return ["shop", send]   }

        else if (check_list_uv["takeup"])   {return ["takeup", send] }

    }

}



// ДАННЫЙ СКРИПТ ДОЛЖЕН ЗАПУСКАТЬСЯ ПЕРВЫМ ДЛЯ КОРРЕКТНОЙ РАБОТЫ

// ВСЕГО ПРИЛОЖЕНИЯ УВАЖИТЕЛЬНАЯ ПРОСЬБА ФАЙЛ MANIFEST НЕ ТРОГАТЬ



// форматирование таблицы и ее отправка





// ДАННАЯ ФУНКЦИЯ ПРИВЯЗЫВАЕТ К КНОПКЕ КОПИРОВАНИЕ ЗАДАННОГО ТЕКСТА ИММИТАЦИЯ КОМАНДОЙ CTRL+C

async function ConnectCopyToButton(button, vp) {



    function format_uv(table) {

        for (let i=0; i<table.length; i++) {if (table[i] == -1) {table[i] = ""}}

        let send = table.join("\t")

        return send

    }



    document.onkeydown = function(e1){

        e1 = e1 || window.event;

        if(e1.altKey && e1.key === "s") {

                if (vp[17]) {if (!(button[1][1].checked)) {vp[17] = -1}}

                if (vp[31]) {if (button[1][0].checked) {vp[32] = vp[31];vp[31] = -1;}}

        

                navigator.clipboard.writeText(format_uv(vp))

                    .then(() => {

                        console.log(`Успешно скопировано в буфер обмена!`)

                    })

                    .catch(err => {

                        console.log("Ошибка", err);

                    });

        } 

    }



    button[0].addEventListener("click", () => {

        if (vp[17])

            if (vp[17]) {if (!(button[1][1].checked)) {vp[17] = -1}}

            if (vp[31]) {if (button[1][0].checked) {vp[32] = vp[31];vp[31] = -1;}}

    

            navigator.clipboard.writeText(format_uv(vp))

                .then(() => {

                    console.log(`Успешно скопировано в буфер обмена!`)

                })

                .catch(err => {

                    console.log("Ошибка", err);

                });

    })  

}



function GetTime(tm, start=10, end=22) { 



    function two(number) {

        let n = number.toString().split("")

        if (n.length == 1) {

            return "0"+n[0]

        } else {

            return number.toString()

        }

    }



    // разбиение строки даты на массив для форматирования для

    // встроенного класса Date

    let date = tm[0] 

    date = date.split(".")

    let obj = new Date(`${date[1]}.${date[0]}.${date[2]}`)



    // разбиение строки даты на массив для форматирования для

    // дальнейшего получения секунд для сравнения

    let time = tm[1]

    time = time.split(":")



    // проверка на размер числа

    if ((time[0].length != 1) & (time[0][0] == "0")) {time[0] = Number(time[0][1])}

    else if (time[0].length == 1) {time[0] = Number(time[0][0])}

    else {time[0] = Number(time[0])}

    if (time[1][0] == "0") {time[1] = Number(time[1][1])}

    if (time[2][0] == "0") {time[2] = Number(time[2][1])}



    // итоговое форматирование

    let time_to_send = `${two(time[0])}:${two(time[1])}`



    // получение секунд для сравнения

    sec_time = time[0]*60*60 + time[1]*60 + time[2]*1

    sec_end = 60*60*end 

    sec_start = 60*60*start

    day_time = 24*60*60



    let type_of_shift = -1 // проверочное число

    if (((sec_time > sec_end) & (sec_time > sec_start)) || ((sec_time < sec_end) & (sec_time < sec_start))) {

        // ночная смена вроде не понятно зачем здесь эта функция

        type_of_shift = false



        // но мы делаем дату на 1 день меньше так как это все еще твоя смена брат

        if (((sec_time > sec_end) & (sec_time < day_time))) {type_of_shift = false} else {

            obj.setDate(obj.getDate() - 1)

            type_of_shift = false

        }



    } else if ((sec_time < sec_end) & (sec_time >= sec_start)) {

        type_of_shift = true // дневная смена радуйся проценту как и твой писюн)

    }



    // получение итоговой даты 

    let year = obj.getFullYear()

    let month = obj.getMonth()+1

    let day = obj.getDate()

    let date_to_send = `${two(day)}.${two(month)}.${year}`

    return [type_of_shift, date_to_send, time_to_send]

}







async function InsertButton(settings, css, salt=false) {   



    let bts = {

        "box_2456": {

            "position":                 "fixed", 

            "height":                   "150px",

            "width":                    "250px",

            "background":   "rgb(71, 143, 202)", 

            "z-index":                    "100", 

            "right":                      "0px", 

            "top":                       "87px",

            "border-top-left-radius":    "15px",

            "border-bottom-left-radius": "15px",

            "transition":    "0.3s ease-in-out",

            "display":                   "flex",

            "justify-content": "space-beetween",

            "align-items":             "center",

            "flex-direction":           "column"

        },

        "header": {

            "display": "flex",

            "justify-content": "space-around",

            "align-items": "center",

            "flex-direction": "row",

            "border-top-left-radius":    "15px",

            "height": "30px",

            "width": "100%",

            "background": "rgb(62, 133, 190)",

            "color": "white"

        },



        "body": {

            "display": "flex",

            "align-items": "center",

            "justify-content": "center",

            "flex-direction": "column",

            "border-top-left-radius":    "15px",

            "border-bottom-left-radius": "15px",

            "height": "100%",

            "width": "100%",

            "background": "rgb(74, 146, 204)",

            "color": "white"

        },





        "refresh": {

            "display": "flex",

            "justify-content": "center",

            "align-items": "center",

            "height": "100%",

            "width": "70%",

            "background": "rgb(62, 133, 190)"

        },

        "title": {

            "display": "flex",

            "justify-content": "center",

            "align-items": "center",

            "height": "100%",

            "width": "100%"

        },

        "checks": {

            "sbp": ["СБП", "a"],

            "dc": ["Новая ДК", "d"]

        },

        "copybutton": {

            "height": "50%",

            "width": "100%",

            "display": "flex",

            "justify-content": "center",

            "align-items": "center",

            "color": "white",

            "background": "#043863"

        },

        "checkbox": {

            "display": "flex",

            "align-items": "center",

            "justify-content": "space-between",

            "flex-direction": "row",

            "height": "100%",

            "width": "100%",

            "color": "white"

        }

    }



    



    function setcss(element, css_list) {

        let css = "";

        for (let key in css_list) {css += `${key}:${css_list[key]};`}; 

        element.style = css

    }



    let main_pop = document.createElement("span")

    main_pop.classList.add("box_2456")

    setcss(main_pop, bts["box_2456"])



    main_pop.style.transform="translateX(220px)"

    main_pop.addEventListener("mouseover", () => {

        main_pop.style.transform="translateX(0)"

    })

    main_pop.addEventListener("mouseout", ()=> {

        setTimeout(()=> {

            main_pop.style.transform="translateX(220px)"

        }, 5000)

    })

    

    let css_f = document.createElement("style")

    css_f.innerHTML = css

    let body = document.body



    let box_header = document.createElement("span")

    box_header.classList.add("header2356")

    setcss(box_header, bts["header"])



    let box_body = document.createElement("span")

    box_body.classList.add("body2356")

    setcss(box_body, bts["body"])



    let copybtn = document.createElement("span")

    copybtn.classList.add("copybutton")

    copybtn.innerHTML += "Копировать (<b>Alt+S</b>)"

    setcss(copybtn, bts["copybutton"])



    copybtn.addEventListener("mouseover", () => {

        copybtn.style.background="#174f7e"

        copybtn.style.cursor="pointer"

    })

    copybtn.addEventListener("mouseout", ()=> {

        setTimeout(()=> {

            copybtn.style.background="#246497"

            copybtn.style.cursor="default"

        }, 2000)

    })

    

    let checks_block = document.createElement("div")

    checks_block.classList.add("checks_block")

    setcss(checks_block, bts["checkbox"])



    let checkboxes = bts["checks"]



    send = []



    for (let elem in checkboxes) {



        let checky = document.createElement("span")

        checky.classList.add(elem[0]+"block")

        checky.style="display: flex; justify-content:center; align-items:center; flex-direction:row; height:100%;width:100%;"



        let checkbox = document.createElement("input")

        checkbox.classList.add(elem)

        checkbox.style.marginRight="3px"

        checkbox.type = "checkbox"

        console.log(checkboxes)

        let clable = document.createElement("label")

        clable.innerHTML += checkboxes[elem][0]

        clable.style.marginRight="3px"



        function toogle() {checkbox.checked = !(checkbox.checked)}



        checky.appendChild(checkbox)

        checky.appendChild(clable)

        checks_block.appendChild(checky)

        send.push(checkbox)

    }



    console.log(checks_block)

    

    box_body.appendChild(copybtn)

    box_body.appendChild(checks_block)

    

    



    let title = document.createElement("span")

    title.classList.add("title2356")

    title.innerHTML += "VpUtillity 3.0"



    setcss(title, bts["title"])



    box_header.appendChild(title)

    // box_body.appendChild()



    main_pop.append(box_header)

    main_pop.append(box_body)

    

    body.append(main_pop)



    return [copybtn, send]

}







async function run_vp_extention_2345() {



    const css_file = await get_config("style.css", false)

    console.log(css_file)

    const settings =      await get_config("settings.json")

    console.log("settings", settings)

    const all_tables_sorted =     await GetTables(settings)

    console.log("tables", all_tables_sorted)

    const end_time_to_send = GetTime(

        await all_tables_sorted[0]["datetime"].split(", "))

    console.log("time:",  end_time_to_send)

    const traffic = all_tables_sorted[0]["traffic"]

    console.log("trafic: " + traffic)

    

    



    let template_config = settings["type_of_page"]



    const tamplate_t = {

        "te": settings["enter"],

        "ts": settings["type_of_page"]["shop"]   [1],

        "tm": settings["type_of_page"]["market"] [1],

        "ni": settings["type_of_page"]["no_item"][1],

        "tb": settings["type_of_page"]["buyer"]  [1]

    }

    

    async function scan_template(template) {

        // шаблоны для каждого из типа страниц

        let vp_list = Array(settings["add"][0]).fill(-1)  // создание массива

        

        let info = await check_list_uv_234(traffic, tamplate_t, all_tables_sorted, settings)  // получение информации о странице

        let temp =                                                      template[info[0]][0] // подбираем шаблон под страницу

        let no_uv =                                                                    false // надобность в ув

        let mst =                                                          settings["order"]

        if (mst.includes(info[0]))                                            {no_uv = true}



        console.log("info", info)



        // если шаблона нет, выбираем пустой шаблон

        if (temp === undefined) {temp = template["empty"][0]}



        // начальный шаблон с тонкой настройкой для всех шаблонов (по умолчанию default, лучше не менять)

        let default_values_index = {"shift": 0,   "date": 1,   "time": 2,  "name": 39}

        let default_values = {"shift": true, "date": true, "time": true, "name": true}

        

        const DAY_SHOP = info[1][2]



        var type_of_page_to_copy = undefined



        function default_values_insert(values) {



            // если смена дневная "д" если нет "н"

            if (default_values["shift"]) {

                if (!DAY_SHOP) {

                    if (end_time_to_send[0]) {vp_list[default_values_index["shift"]]="д"} 

                    else                     {vp_list[default_values_index["shift"]]="н"}

                } else                       {vp_list[default_values_index["shift"]]="д"}  

            }



            if (default_values["date"]) {vp_list[default_values_index["date"]]            = end_time_to_send[1]}   // дата   

            if (default_values["time"]) {vp_list[default_values_index["time"]]            = end_time_to_send[2]}   // время 

            if (default_values["name"]) {vp_list[default_values_index["name"]] = all_tables_sorted[0]["seller"]}   // имя продавца

        }



        // если в массиве один элемент default, то для страницы используются дефолтные настройки

        if ((temp[0].length === 1) & (temp[0][0] === "default")) {

            temp[0] = default_values

            default_values_insert(temp[0])

        }



        else if (Object.keys(temp[0]).length === 4) {default_values_insert(temp[0])}

        

        vp_list[3]                                                           = temp[1][0]    // вход 

        vp_list[4]                                                           = temp[1][3]    // не клиент 

        if (!no_uv) {vp_list[tamplate_t["tb"][traffic]]                      = temp[1][1]}   // ув (5 - 16)

        if (info[1][1]) {vp_list[17]                                         = temp[1][2]}   // дк

        if (Object.keys(all_tables_sorted[2]).includes("636")) {vp_list[19]  = temp[1][2]}   // 636 проверка наличия

        if (no_uv) {vp_list[21]                                              = temp[2][0]}   // учет заказов

        if (no_uv) {vp_list[tamplate_t["tm"][traffic]]                       = temp[2][0]}   // заказы 24-25 ozon яндекс

        if (no_uv) {vp_list[tamplate_t["ts"][traffic]]                       = temp[2][0]}   // заказы 22-23 самовывоз приложение



        // все товары и их свойства

        let items = all_tables_sorted[2]



        // если список не пуст

        if (Object.keys(items).length > 0) {



            let desc = []

            let arts = []



            // проходимся по массиву

            for (let art in items) {



                // если надо фильтровать

                if (temp[3][3] == 1) {

                    if (!(settings["stop"].includes(art))) {

                        desc.push(items[art]["desc"])

                        arts.push(art)

                    } 



                } else {

                    desc.push(items[art]["desc"])

                    arts.push(art)

                }

            } 



            let count_of_items = 0



            for (let i = 0; i < arts.length; i++) {

                let a = arts[i]

                count_of_items += Number(items[a]["count"])

            }



            if (temp[3][1] != 1)                                                          {desc = []}

            let comment_245 =                                         all_tables_sorted[0]["comment"]

            if (temp[3][4] == 1 & !(["Не задан", ""].includes(comment_245))) {desc.push(comment_245)}

            vp_list[26] =  desc.join(" ")

            vp_list[29] = arts.join("; ") 



            if (temp[3][2] == -1) {vp_list[29] = temp[3][2]}



            if (temp[3][0] != 1) {

                vp_list[27] = temp[3][0]

                vp_list[28] = temp[3][0]

            } else {

                vp_list[27] =              1

                vp_list[28] = count_of_items

            }



        }  



        function cd(n) {

            let num = n.split(".")

            if (num[1] == "00") {

                return num[0]

            } else {

                if (num[1][1] == "0") {

                    num[1] = num[1][0]

                }

                return num.join(".")

                

            }

        }



        m = [Number(cd((all_tables_sorted[1]["cash"]))), Number(cd((all_tables_sorted[1]["no_cash"]))), Number(cd((all_tables_sorted[1]["sbp"])))]

        for (let i = 0; i<3; i++) {

            if (m[i] == 0) {

                m[i] = -1

            }

        }



        // нал безнал

        cash_nocash = [m[0], m[1] + m[2]]

        if (cash_nocash[1] < 0) {cash_nocash[1] = -1}



        // нал безнал сбп

        cash_nocash_sbp = [m[0], m[1], m[2]]

        

        // обычная оплата 

        if (temp[4][0] === 1) {

            vp_list[30] = cash_nocash_sbp[0]

            vp_list[31] = cash_nocash_sbp[1]

            vp_list[32] = cash_nocash_sbp[2]



        // оплата заказа

        } else if (temp[4][1] === 1) {

            vp_list[33] = cash_nocash[0]

            vp_list[34] = cash_nocash[1]



        // возврат денег

        } else if (temp[4][2] === 1) {

            vp_list[37] = cash_nocash[0]

            vp_list[38] = cash_nocash[1]

        }

        return vp_list

    }



    await ConnectCopyToButton(await InsertButton(settings, css_file), await scan_template(template_config))





}



run_vp_extention_2345()
