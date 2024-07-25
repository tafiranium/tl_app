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


async function InsertButton() {   

    const button_config = await get_config("button")
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