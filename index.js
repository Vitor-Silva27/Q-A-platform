const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const connection = require('./database/database');

const Question = require("./models/Question");

const QuestionController = require("./controllers/QuestionsController")
const AnswerController = require("./controllers/AnswersController")

connection
    .authenticate()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.log(err);
    })


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use("/",QuestionController);
app.use("/",AnswerController);

app.get("/", (req, res) => {
    Question.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(questions => {
        console.log(questions);
        res.render("index", {
            questions: questions
        });
    })
});


app.listen(8080, () => {
    console.log("is running!");
});