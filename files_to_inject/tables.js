async function GetTables() {

    const ttemp = await get_config("tt")
    function st(n) {return document.querySelector(ttemp["sel"][n])}
    let table_detail_view =       st(0)
    let table_price_detail_view = st(1)
    let all_items =               st(2)

    function GetDetails() {

        console.log("Function: GetDetails() is started!")

        function detail_table(n, to, inner=true) {
            if (inner) {return table_detail_view.querySelector(`tr:nth-child(${n}) ${to}`).innerHTML} 
            else {return table_detail_view.querySelector(`tr:nth-child(${n}) ${to}`)} 
        }

        send = {}

        let details = ttemp["details"]
        for (key in details) {
            let d = details[key]
            send[key] = detail_table(d[0], d[1], d[2])
            console.log(detail_table(d[0], d[1], d[3]), d[0], d[1], d[2])
        }
        console.log(send, ttemp, details)
        return send
    }

    // получение деталей об получение оплаты (нал безнал сбп)
    function GetMoneyDetails() {

        console.log("Function: GetMoneyDetails() is started!")

        function money_table(n) {
            return table_price_detail_view.querySelector(`tr:nth-child(${n}) td`
                ).innerHTML.replace(" ", "").replace("руб.", "").split(".")[0]
        }

        let temp = {
            cash:    money_table(1), // нал
            no_cash: money_table(2), // безнал
            sbp:     money_table(3)  // сбп
        }
        
        // если нет определенного типа оплаты то -1 (пустота)
        for (let key in temp) {
            if (temp[key]=="0") {
                temp[key]=-1
            }
        } 
        return temp
    }

    // получение таблицы с товарами
    function GetItemTable() {

        console.log("Function: GetItemTable() is started!")

        let send = {}     

        // получение информации о товаре
        all_items.forEach((item) => {
            
            function isNumeric(num){
                return !isNaN(num)
              }
            // строка с артикулом название и описанием
            let all = item.querySelector("td:nth-child(2)").innerHTML 

            // все что мы можем сделать отделить артикул и описание больше и не надо
            let art = all.slice(0, all.indexOf(' '))            // артикул

            if (isNumeric(art)) {

                let name = all.slice(all.indexOf(' '), all.length)  // описание

                // в гугл таблицах максимальная длина строки 27 символов режем описание для умещения контента
                if (name.length > 27) {
                    name = name.slice(0, 27)
                }

                // количество товара (переменная в коде простаивает может пригодится)
                let count = item.querySelector("td:nth-child(3)").innerHTML.split(".")[0] 

                // с ключем артикулом создаем словарь с описанием и количеством товара
                send[art] = {"desc": name, "count": count}

            } else {

                let name = all

                // количество товара (переменная в коде простаивает может пригодится)
                let count = item.querySelector("td:nth-child(3)").innerHTML.split(".")[0] 

                send[0] = {"desc": name, "count": count}

            }
        })

        return send
    }

    // функция возвращает отсортированную и пропарсенную информацию. (ничего лишнего)
    console.log(GetDetails(), GetMoneyDetails(), GetItemTable())
    return [GetDetails(), GetMoneyDetails(), GetItemTable()]
}





