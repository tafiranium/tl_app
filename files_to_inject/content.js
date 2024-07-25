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

    // размер УВ
    const uv_size = 40
    const all_tables_sorted = await GetTables()
    const traffic = all_tables_sorted[0]["traffic"]
    
    // "01.02.24, 24:00:00" ==> ["01.02.24", "24:00:00"]
    const end_time_to_send = await GetTime(all_tables_sorted[0]["datetime"].split(", "))
    console.log(end_time_to_send)
    

    console.log("trafic: " + traffic)

    let template_config = await get_config("pull")
    const tamplate_t = {
        "te": await get_config("et"),
        "ts": await get_config("ts"),
        "tm": await get_config("tm"),
        "ni": await get_config("ni"),
        "tb": await get_config("tb")
    }
    
    // создание кнопки
    const button = await InsertButton()
    let STOP_LIST = await get_config("sp")

    async function scan_template(template) {
        // шаблоны для каждого из типа страниц
        let vp_list = Array(uv_size).fill(-1)  // создание массива
        
        let info = await check_list_uv_234(traffic, tamplate_t, all_tables_sorted)  // получение информации о странице
        let temp = template[info[0]]    // подбираем шаблон под страницу
        console.log(info)
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

        // если в массиве 4 элемента то на странице, где какой либо из элементов
        // отключен не будут отображаться вовсе.
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

                
                console.log(STOP_LIST)
                // если надо фильтровать
                if (temp[3][3] == 1) {
                    if (!(STOP_LIST.includes(art))) {
                        
                        desc.push(items[art]["desc"])
                        arts.push(art)
                    } 

                // в другом случае просто пропускаем все товары
                } else {
                    desc.push(items[art]["desc"])
                    arts.push(art)
                }

            } 

            if (temp[3][1] != 1) {desc = []}

            // если нужен комментарий
            let comment_245 = all_tables_sorted[0]["comment"]
            if (temp[3][4] == 1 & !(["Не задан", ""].includes(comment_245))) {desc.push(comment_245)}

            // если комментарий вовсе не нужен
            vp_list[26] = desc.join(" ")

            vp_list[29] = arts.join("; ") 
            if (temp[3][2] == -1) {vp_list[29] = temp[3][2]}

            // если -1 не показывет, если 0 то все обазначает 0
            if (temp[3][0] != 1) {
                vp_list[27] = temp[3][0]
                vp_list[28] = temp[3][0]
            
            // если 1 то показывет количество товаров
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





