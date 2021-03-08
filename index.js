const express = require("express");
const app = express(); 

const bodyParser = require("body-parser");
const connection = require('./database/database');

const Question = require("./database/Question");
const Answer = require("./database/Answer");


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

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

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

app.get("/ask", (req, res) => {
    res.render("ask");
})

app.post("/savequestion", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    
    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/question/:id", (req, res) => {
    const id = req.params.id;
    Question.findOne({
        where: {
            id: id
        }
    }).then(question => {
        if (question != undefined) {
            Answer.findAll({
                where: {
                    questionId: question.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(answers => {
                res.render("question", {
                    question: question,
                    answer: answers
                });
            });
        } else {
            res.redirect("/");
        }
    })
})

app.post("/toanswer", (req, res) => {
    let body = req.body.body;
    let questionId = req.body.question;
    Answer.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/" + questionId);
    });
});


app.listen(8080, () => {
    console.log("is working!");
});