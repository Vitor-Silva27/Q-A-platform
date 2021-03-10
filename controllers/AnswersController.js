const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");

router.post("/toanswer", (req, res) => {
    let body = req.body.body;
    let questionId = req.body.question;
    if (body !== '') {
        Answer.create({
            body: body,
            questionId: questionId
        }).then(() => {
            res.redirect("/question/" + questionId);
        });
    }else{
        res.redirect("/question/" + questionId);
    }
});

module.exports = router;