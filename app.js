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


// база данных, подключен модуль sqlite3
const sqlite3 = require('sqlite3').verbose();
let sqlite = require('sqlite-sync'); //requiring
//Connecting - if the file does not exist it will be created





// РОУТИНГ 
// определяем обработчик для маршрута "/"
app.get('/', function (request, response) {
    sqlite.connect('./pet-db.db');
    let petsArrayFromDb
    // limit для ограничения количества карточек питомцев в слайдере
    sqlite.run("SELECT * FROM pets ORDER BY id LIMIT 8;", function (res) {
        if (res.error) { throw res.error }

        petsArrayFromDb = res
    })
    // отправляем ответ
    response.render('index', {
        petsArray: petsArrayFromDb
    })
})

app.get('/pets', function (request, response) {
    // создали переменную для последующего ее использования, вместо params используется query из-за особенностей express.js. Переменная (динамическая - выводит тот номер страницы, на которую производится клик) означает текущую страницу, то есть показывает данные какой страницы отдавать
    let currentPage = request.query.page

    //условие для того, чтобы отображалась страница /pets, так как в ней не используются параметры (которые находятся в переменной currentPage), соответственно при отсуствии параметров currentPage становится undefined 
    if (currentPage == undefined) {
        currentPage = 1
    }
    // переменная limitItem, показывающая количество выводимых item (в нашем случае карточек животных) на одной странице пагинации
    let limitItem = 8

    // переменная afterRow, которая указывает бд ПОСЛЕ какого номера item показывать выборку для текущей страницы пагинации согласно с limitItem, то есть на 2 странице будут показываться 2 item (согласно limitItem), начиная с 3 item в списке бд (о чем нам говорит переменная afterRow)
    let afterRow
    // переменная afterRow динамическая и зависит от currentPage и limitItem, выражение ниже вычисляет с какой позиции в списке бд будет начинаться та или иная страница пагинации
    afterRow = (currentPage - 1) * limitItem

    // console.log(currentPage, afterRow)

 


    // отправляем ответ
    sqlite.connect('./pet-db.db');

    //Creating table - you can run any command
    let petsArrayFromDb
    sqlite.run(`SELECT * FROM pets LIMIT ${afterRow}, ${limitItem};`, function (res) {
        if (res.error) { throw res.error }

        petsArrayFromDb = res
    })
    let allDataRows
    sqlite.run("SELECT Count(*) FROM pets", function (res) {
        if (res.error) { throw res.error }
        allDataRows = res[0]
        allDataRows = allDataRows["Count(*)"]
        // console.log(allDataRows)
    })

    // console.log(petsArrayFromDb)
    // перенесена логика из ejs в бэкенд, для того чтобы при выборе первой страницы в пагинации слева не отображалась нулевая страница
    let intCurrentPage = parseInt(currentPage)

    let pages = []

    if (intCurrentPage > 1) {
        pages = [intCurrentPage - 1, intCurrentPage, intCurrentPage + 1]

    } else {
        pages = [1, 2, 3]
    }
    let lastPageNum = Math.ceil(allDataRows / limitItem)
    if (intCurrentPage == lastPageNum) {
        pages = [intCurrentPage - 2, intCurrentPage - 1, intCurrentPage]

    }
    // слева переменные для ejs, справа переменные бэкенда, значения которых передаются в шаблонизатор
    response.render('pets', {
        petsArray: petsArrayFromDb,
        pagesNum: pages,
        lastPage: lastPageNum,
        currentPage: intCurrentPage
    })
    
})


app.get('/pets/:petIDName', function (request, response) {
    // отправляем ответ
    // объявили переменную с тем же названием, что и параметр :petIDName, параметр хранится в запросе (request), получили в переменной параметр из запроса
    let petIDName = request.params.petIDName
    // объявили переменную с функцией, которая парсит число из строки, для отделения числа от имени в ссылке PetIDName, для последующего использования только числа id в запросе
    let petID = parseInt(petIDName)
    let query = `SELECT * FROM pets WHERE id=${petID};`
    // return response.send(request.params.petID)
    sqlite.connect('./pet-db.db');

    //Creating table - you can run any command
    let petFromDb
    sqlite.run(query, function (res) {
        if (res.error) { throw res.error }

        petFromDb = res
    })
    // console.log(petFromDb)

    response.render('pet', {
        onePet: petFromDb[0]
    })
})

// начинаем прослушивать подключения на 3000 порту
app.listen(3000)