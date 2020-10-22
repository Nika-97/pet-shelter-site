// ИНИЦИАЛИЗАЦИЯ СЕРВЕРА/ФРЕЙМВОРКА
// подключение express
const express = require('express')
// создаем объект приложения / instance + сервер 
const app = express()
// подключение ejs шаблонизатора в проект
app.set('view engine', 'ejs')
// Определяем папку public  для статических файлов стилей скриптов
// папка public это внешняя папка для юзера в браузере
// там уже находятся готовые скомпилированные файлы 
app.use(express.static("public"))

// РОУТИНГ 
// определяем обработчик для маршрута "/"
app.get('/', function (request, response) {
    // отправляем ответ
    response.render('index' )
})

app.get('/pets', function (request, response) {
    // отправляем ответ
    response.render('pets')
})

app.get('/test1', function (request, response) {
    // отправляем ответ
    
    let sliderDataFromBD = ['pet1', 'pet2', 'pet3']
    
    response.render('test-view', {
        title: "test",
        h2: "test1 page",
        sliderVarEjs: sliderDataFromBD
    })
})

app.get('/pet', function (request, response) {
    // отправляем ответ
    response.render('pet')
})

// начинаем прослушивать подключения на 3000 порту
app.listen(3000)