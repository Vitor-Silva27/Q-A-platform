const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const Answer = require("../models/Answer");

router.get("/ask", (req, res) => {
    res.render("ask");
})

router.post("/savequestion", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    Question.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

router.get("/question/:id", (req, res) => {
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

module.exports = router;