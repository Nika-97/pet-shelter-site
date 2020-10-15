// ИНИЦИАЛИЗАЦИЯ СЕРВЕРА/ФРЕЙМВОРКА
// подключение express
const express = require('express')
// создаем объект приложения / instance
const app = express()


// РОУТИНГ 
// определяем обработчик для маршрута "/"
app.get('/', function (request, response) {
    // отправляем ответ
    response.send('<h2>Привет Express!</h2>')
})

app.get('/pets', function (request, response) {
    // отправляем ответ
    response.send('<h2>Страничка Pets</h2>')
})



// начинаем прослушивать подключения на 3000 порту
app.listen(3000)