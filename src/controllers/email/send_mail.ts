import * as nodemailer from 'nodemailer';

async function sendEmail() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com', // Your SMTP host
        port: 587, // Your SMTP port
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.FROM_EMAIL,
		    pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from:  `"PlanIt Poker" <${process.env.FROM_EMAIL}>`, 
        // to: ['geevarghesemvarghese@gmail.com',"mariyam.ali@experionglobal.com","dencymol.baby@experionglobal.com","geevarghese.varghese@experionglobal.com","aljo.biju@experionglobal.com", "hariprasad.j@experionglobal.com", "angelina.robin@experionglobal.com", "suneesh39@gmail.com", "lekshmi.ashokan.a@gmail.com" ], // List of recipients
        to: 'geevarghese.varghese@experionglobal.com', 
        subject: ' First Email 🚀', 
        text: `Dear All,

I hope this email finds you all well! 😊
        
I'm excited to announce that we've successfully set up our new email system for PlanIt Poker, and I'm sending out our very first email using it. 🎉
        
Looking forward to all the great things we'll achieve together!
        
Best regards,
Geevarghese Manamel Varghese,
Assistant Team Lead,
Agile Architects` 
};

    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
}

sendEmail().catch(console.error);

