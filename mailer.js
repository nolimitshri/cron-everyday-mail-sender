const mailer = require("nodemailer");

const transporter = mailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

module.exports.sendAnEmail = async(email, time) => {
    console.log("Reciever's Email ID: " + email);

    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Test Email by AVIPL",
        text: `Hey ${email} this mail was sent to you by AVIPL using CRON-Scheduler\nYour Scheduled Meeting is at: ${time}`
    }, (err, info) => {
        if(err){
            console.log(err);
        } else {
            console.log(info.response);
        }
    })
};