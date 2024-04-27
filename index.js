const express = require("express");
var cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

// user wrong authentication

async function sendBookingEmail(data) {
  // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
  const auth = {
    auth: {
      api_key: process.env.EMAIL_SEND_KEY,
      domain: process.env.EMAIL_SEND_DOMAIN,
    },
  };

  const transporter = nodemailer.createTransport(mg(auth));

  transporter.sendMail(
    {
      from: data.email,
      to: process.env.EMAIL_RECEIVER,
      subject: `Portfolio message`,
      // 'replyTo': 'sagormdtohid@gmail.com',

      text: data.message,

      //     html: `
      //   <div>
      //   <p>${patient}</p>
      //   <p>${treatment}</p>
      //   <p>${date}</p>
      //   <p>${slot}</p>
      //   </div>
      //   `
    },
    (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log(`Response: ${info}`);
      }
    }
  );
}

async function run() {
  try {
    app.post("/contact", async (req, res) => {
      const data = req.body;
      console.log(data);
      await sendBookingEmail(data);
      res.send({ result: true });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
