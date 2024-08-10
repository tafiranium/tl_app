class VpTime {
    constructor(time_obj=false, interval=[10, 22]) {
        
        this.datetime_list =   time_obj
        this.start =        interval[0]
        this.end =          interval[1]

        this.date = this.datetime_list[0].split(".")
        this.time = this.datetime_list[1].split(":")

        this.object = new Date(`${this.date[1]}.${this.date[0]}.${this.date[2]}`)

        this.sec_time   =   this.time[0]*60*60 + this.time[1]*60 + this.time[2]*1
        this.sec_end    =   60*60*this.end 
        this.sec_start  =   60*60*this.start
        this.day_time   =   24*60*60
        
        this.type_of_shift = -1 // проверочное число
        this.getTypeShift()

        this.year    =  this.object.getFullYear()
        this.month   =  this.object.getMonth()+1
        this.day     =  this.object.getDate()

        this.time_to_send = this.getTime()
        this.date_to_send = `${this.two(this.day)}.${this.two(this.month)}.${this.year}`
        this.tdtm = [this.type_of_shift, this.date_to_send, this.time_to_send]
        console.log(this.tdtm)

    }

    two(number) {
        let n = number.toString().split("")
        if (n.length == 1) {return "0"+n[0]} else {return number.toString()}
    }

    getTypeShift() {
        let first_night_part = !!((this.sec_time > this.sec_end) & (this.sec_time > this.sec_start))
        let second_night_part = !!((this.sec_time < this.sec_end) & (this.sec_time < this.sec_start)) 
            if (first_night_part || second_night_part) {
            // ночная смена вроде не понятно зачем здесь эта функция
            this.type_of_shift = false
            // но мы делаем дату на 1 день меньше так как это все еще твоя смена брат
            if (second_night_part) {this.object.setDate(this.object.getDate() - 1) }
    
        } else if ((this.sec_time < this.sec_end) & (this.sec_time >= this.sec_start)) {
           this.type_of_shift = true // дневная смена радуйся проценту как и твой писюн)
        }
    }

    getTime() {
         // проверка на размер числа
        if ((this.time[0].length != 1) & (this.time[0][0] == "0")) {this.time[0] = Number(time[0][1])}
        else if (this.time[0].length == 1) {this.time[0] = Number(this.time[0][0])}
        else {this.time[0] = Number(this.time[0])}
        if (this.time[1][0] == "0") {this.time[1] = Number(this.time[1][1])}
        if (this.time[2][0] == "0") {this.time[2] = Number(this.time[2][1])}

        // итоговое форматирование
        return `${this.two(this.time[0])}:${this.two(this.time[1])}`   
    }
}
