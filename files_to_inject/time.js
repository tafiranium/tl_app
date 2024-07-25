console.log("Started file: time.js")
// ДАННАЯ ФУНКЦИЯ ФОРМАТИРУЕТ ВРЕМЯ И ЗАНИМАЕТСЯ ПРОВЕРКОЙ ТИПА СМЕНЫ

async function GetTime(tm, start=10, end=22) { 
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