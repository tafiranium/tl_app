console.log("Started file: templates.js")

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
            console.log(table_detail_view)
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
            return table_price_detail_view.querySelector(`tr:nth-child(${n}) td`
                ).innerHTML.replace(" ", "").replace("руб.", "").split(".")[0]
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
    let check_list_uv = {
        "buyer":    (t["buyer"][1][traffic]  != undefined),
        "market":   (t["market"][1][traffic] != undefined),
        "shop":     (t["shop"][1][traffic]   != undefined),
        "takeup":   (t["shop"][1][traffic]   != undefined),
        "open":     (all_tables_sorted[2][0] != undefined),
        "return":   (all_tables_sorted[0]["return"].classList.contains("cssDisplayNone") != true),
        "no_item":  !!((template["ni"].includes(traffic)) & ((Object.keys(all_tables_sorted)[0] == 0)) & 
                                    (Object.keys(await all_tables_sorted[2]).length <= 1)),
        "enter": (settings["enter"].includes(traffic)),
        "dc": ((all_tables_sorted[0]["dc"] != "Не задан") & (all_tables_sorted[0]["buyer"] != "Не задан") &
                (all_tables_sorted[0]["dc"] != "") & (all_tables_sorted[0]["buyer"] != ""))
    }

    if (check_list_uv["open"] == true) {check_list_uv["open"] = (await all_tables_sorted[2][0]['desc'] == "открытие смены")}
    let send = [check_list_uv["enter"], check_list_uv["dc"], settings["shops"][all_tables_sorted[0]["shop"]]]

    if (check_list_uv["return"]) {return ["return", send];}     else {
        if      (check_list_uv["open"])     {return ["open", send]   }
        if      (check_list_uv["no_item"])  {return ["no_item", send]}
        else if (check_list_uv["buyer"])    {return ["buyer", send]  }
        else if (check_list_uv["market"])   {return ["market", send] }
        else if (check_list_uv["shop"])     {return ["shop", send]   }
        else if (check_list_uv["takeup"])   {return ["takeup", send] }
    }
}


console.log("Started file: button.js")
// ДАННЫЙ СКРИПТ ДОЛЖЕН ЗАПУСКАТЬСЯ ПЕРВЫМ ДЛЯ КОРРЕКТНОЙ РАБОТЫ
// ВСЕГО ПРИЛОЖЕНИЯ УВАЖИТЕЛЬНАЯ ПРОСЬБА ФАЙЛ MANIFEST НЕ ТРОГАТЬ

// ДАННАЯ ФУНКЦИЯ ПРИВЯЗЫВАЕТ К КНОПКЕ КОПИРОВАНИЕ ЗАДАННОГО ТЕКСТА ИММИТАЦИЯ КОМАНДОЙ CTRL+C
async function ConnectCopyToButton(button, text_to_copy="Тестовый текст не имеющий смысла, если ты это видишь значит в коде ошибка!") {
    
    console.log("Function:  ConnectCopyToButton(button, text_to_copy) is started!")
    button.addEventListener("click", () => {
        navigator.clipboard.writeText(text_to_copy)
                .then(() => {
                    console.log(`"${text_to_copy}" - скопировано в буфер обмена!`)
                })
                .catch(err => {
                    console.log("Ошибка", err);
                });
    })  
}

console.log("Started file: time.js")
// ДАННАЯ ФУНКЦИЯ ФОРМАТИРУЕТ ВРЕМЯ И ЗАНИМАЕТСЯ ПРОВЕРКОЙ ТИПА СМЕНЫ

function GetTime(tm, start=10, end=22) { 
// ["01.01.24", "23:00:21"] / время начала смены / время конца смены
    
    console.log("Function: GetTime(tm, start, end) is started!")

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

    console.log(sec_time, sec_end, day_time)

    let type_of_shift = -1 // проверочное число
    if (((sec_time > sec_end) & (sec_time > sec_start)) || ((sec_time < sec_end) & (sec_time < sec_start))) {
        // ночная смена вроде не понятно зачем здесь эта функция
        type_of_shift = false

        // но мы делаем дату на 1 день меньше так как это все еще твоя смена брат
        if (((sec_time > sec_end) & (sec_time < day_time))) {
            type_of_shift = false
            console.log("test")
        } else {
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

    // [true, "01.01.24", "23:30"]
    console.log(type_of_shift, date_to_send, time_to_send)
    return [type_of_shift, date_to_send, time_to_send]
}

async function InsertButton(settings) {   

    const button_config = settings["button"]
    let mouse_mas = button_config[6]
    let arg = button_config[0]
    
    // форматирование css для внедрения на сайт одной строкой
    function getCss(start, end) {
        let css = "";
        temp = start;

        for (let key in temp) {
            if (Object.keys(end).includes(key)) {
                css = css += `${key}:${end[key]};`
            } else {css = css += `${key}:${temp[key]};`}
        }; return css;
    }

    // Создание кнопки с тегом SPAN (c тегом button в разных 
    // боксах кнопка ведет себя не предсказуемо, лучше избегать этого тега)
    let button = document.createElement("span")
    button.innerHTML += button_config[3]
    button.style = getCss(arg, arg)

    Object.keys(mouse_mas).forEach(type => {
        button.addEventListener(type, (e) => {
            let t = mouse_mas[type]
            e.target.style = getCss(
                button_config[t[0]], 
                button_config[t[1]]
            );
        })
    });

    button.classList.add(button_config[4])
    document.querySelector(button_config[5]).appendChild(button)

    // возвращает DOM element (кнопка, уже внедрена, 
    // кнопку сохраняем для дальнейших манипуляций при желании)
    return button
}

console.log("Started file: content.js!")
const DEBUG_MODE = true

// форматирование таблицы и ее отправка
async function format_uv(table) {
    for (let i=0; i<table.length; i++) {
        if (table[i] == -1) {
            table[i] = ""
        }
    }
    let send = table.join("\t")
    return send
}

async function run_vp_extention_2345() {

    const settings = await get_config("settings.json")
    console.log("settings", settings)
    const all_tables_sorted = await GetTables(settings)
    console.log(all_tables_sorted)
    const end_time_to_send = GetTime(await all_tables_sorted[0]["datetime"].split(", "))
    console.log("time: end_time_to_send")
    const traffic = all_tables_sorted[0]["traffic"]
    console.log("trafic: " + traffic)
    const button = await InsertButton(settings)
    console.log(button)

    let template_config = settings["pull"]

    const tamplate_t = {
        "te": settings["enter"],
        "ts": settings["type_of_page"]["shop"][1],
        "tm": settings["type_of_page"]["market"][1],
        "ni": settings["type_of_page"]["no_item"][1],
        "tb": settings["type_of_page"]["buyer"][1]
    }
    
    async function scan_template(template) {
        // шаблоны для каждого из типа страниц
        let vp_list = Array(settings["add"][0]).fill(-1)  // создание массива
        
        let info = await check_list_uv_234(traffic, tamplate_t, all_tables_sorted)  // получение информации о странице
        console.log(info)
        let temp = template[info[0]]    // подбираем шаблон под страницу
        let no_uv = false               // надобность в ув
        let mst = await get_config("mst")
        if (mst.includes(info[0])) {no_uv = true}

        // если шаблона нет, выбираем пустой шаблон
        if (temp === undefined) {temp = template["empty"]}

        // начальный шаблон с тонкой настройкой для всех шаблонов (по умолчанию default, лучше не менять)
        let default_values_index = {"shift": 0, "date": 1, "time": 2, "name": 39}
        let default_values = {"shift": true, "date": true, "time": true, "name": true}
        
        const DAY_SHOP = info[1][2]
        console.log(DAY_SHOP, info[1])

        function default_values_insert(values) {

            // если смена дневная "д" если нет "н"
            if (default_values["shift"]) {
                if (!DAY_SHOP) {
                    if (end_time_to_send[0]) {vp_list[default_values_index["shift"]]="д"} 
                    else {vp_list[default_values_index["shift"]]="н"}
                } else {vp_list[default_values_index["shift"]]="д"}  
            }

            if (default_values["date"]) {vp_list[default_values_index["date"]] = end_time_to_send[1]}               // дата   
            if (default_values["time"]) {vp_list[default_values_index["time"]] = end_time_to_send[2]}               // время 
            if (default_values["name"]) {vp_list[default_values_index["name"]] = all_tables_sorted[0]["seller"] }   // имя продавца
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

            if (temp[3][1] != 1) {desc = []}
            let comment_245 = all_tables_sorted[0]["comment"]
            if (temp[3][4] == 1 & !(["Не задан", ""].includes(comment_245))) {desc.push(comment_245)}
            vp_list[26] = desc.join(" ")
            vp_list[29] = arts.join("; ") 

            if (temp[3][2] == -1) {vp_list[29] = temp[3][2]}

            if (temp[3][0] != 1) {
                vp_list[27] = temp[3][0]
                vp_list[28] = temp[3][0]
            } else {
                vp_list[27] = 1
                vp_list[28] = arts.length
            }

        }  

        // нал безнал
        cash_nocash = [all_tables_sorted[1]["cash"], (Number(all_tables_sorted[1]["no_cash"]) +  Number(all_tables_sorted[1]["sbp"]))]
        if (cash_nocash[1] < 0) {cash_nocash[1] = -1}

        // нал безнал сбп
        cash_nocash_sbp = [all_tables_sorted[1]["cash"], all_tables_sorted[1]["no_cash"], all_tables_sorted[1]["sbp"]]
        
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
        console.log(vp_list)
        return format_uv(vp_list)
    }

    await ConnectCopyToButton(button, await scan_template(template_config))
}

run_vp_extention_2345()
