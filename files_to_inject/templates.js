console.log("Started file: templates.js")

async function get_config(file) {
    let response = await fetch(`https://raw.githubusercontent.com/tafiranium/point_of_love/main/${file}.json`);

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
    // получаем тело ответа (см. про этот метод ниже)
        return await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}
async function check_list_uv_234(traffic, template, all_tables_sorted) {
    
    
    console.log(await all_tables_sorted)
    let check_list_uv = {
        "buyer": !(template["tb"][traffic] === undefined),
        "market": !(template["tm"][traffic] === undefined),
        "shop": !(template["ts"][traffic] === undefined),
        "takeup": (template["ts"][traffic] != undefined),
        "open": ((await all_tables_sorted[2][0] != undefined)),
        "return": (await all_tables_sorted[0]["return"].classList.contains("cssDisplayNone") != true),
        "no_item": !!((template["ni"].includes(traffic)) & 
                    ((Object.keys(await all_tables_sorted[2])[0] == 0)) & 
                    (Object.keys(await all_tables_sorted[2]).length <= 1)),

        "enter": (template["te"].includes(traffic)),
        "dc": (await all_tables_sorted[0]["dc"] != "Не задан")
    }

    if (check_list_uv["open"] == true) {
        check_list_uv["open"] = (await all_tables_sorted[2][0]['desc'] == "открытие смены")
    }

    console.log(all_tables_sorted, await get_config("shops"), all_tables_sorted[0]["shop"])
    let shops = await get_config("shops")

    let send = [check_list_uv["enter"], check_list_uv["dc"], shops[all_tables_sorted[0]["shop"]]]

    if (check_list_uv["return"]) {
        return ["return", send];

    } else {
        if (check_list_uv["open"]) {
            return ["open", send]
        }
        if (check_list_uv["no_item"]) {
            return ["no_item", send] ;
        }
        else if (check_list_uv["buyer"]) {
            return ["buyer", send]
        }
        else if (check_list_uv["market"]) {
            return ["market", send]
        }
        else if (check_list_uv["shop"]) {
            return ["shop", send]
        }
        else if (check_list_uv["takeup"]) {
            return ["takeup", send]
        }
    }
}


