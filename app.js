require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require("ejs");
const cron = require("node-cron");

const mailer = require("./mailer");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const Mail = require("./model/cron-mailer");

mongoose.connect("mongodb://localhost:27017/cron-work", {
    useNewUrlParser: true
}).then(() => console.log("Connection OK"))
.catch(e => console.log("Connection NOT OK ", e));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", async(req, res) => {
    var {nameH, emailH, dateH} = req.body;
    //2022-03-04T00:55:59.999-06:30
    dateH += ":00.000+05:30";
    var ms = new Date(dateH).getTime();
    console.log(ms);
    console.log(new Date(ms).toISOString());

    const newMail = Mail({
        name: nameH,
        attende: emailH,
        date: dateH
    });
    newMail.save().then(mailSaved => {
        // res.status(200).json({Status: "OK", Message: mailSaved});
        res.redirect("/scheduled");
    }).catch(e => {
        res.json({Status: "Error", Message: e});
    });

});

app.get("/scheduled", async(req, res) => {
    try{
        const meetings = await Mail.find();
        if(meetings.length === 0){
            res.send("No plans to show now!!");
        } else {
            res.send(meetings);
        }
    }catch(e){
        console.log(e);
    }
});

// USING CRON
cron.schedule("0 0 * * *", async() => {
    try{
        const meetings = await Mail.find();
        if(meetings.length === 0){ // Chechking if the DB is Empty !??
            console.log("NO Scheduled Classes for anyone !!");
        } else {
            meetings.forEach(meeting => {
                const msScheduledTime = new Date(meeting.date).getTime() + 86400000; // + 24 Hours (ms)
                const todaysDate = new Date().getTime();
                const str = "We have time For the class, Mail will be sent !!"
                if(todaysDate < msScheduledTime){
                    // console.log(str, meeting.date, msScheduledTime, meeting.attende, todaysDate);
                    mailer.sendAnEmail(meeting.attende, meeting.date);
                } else {
                    // console.log("Sorry class is over now, Go again and reschedule it !!");
                }
            });
        }
    }catch(e){
        console.log(e);
    }
});

app.listen(3000, () => console.log("PORT started at 3000"));