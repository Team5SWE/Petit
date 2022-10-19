import smtplib, ssl
from email.message import EmailMessage

def send_email(email):

    password = "gB7W65@j^$Q!"
    sender = "petit2022nreply@outlook.com"

    if email is None or email == '':
        return False

    context = ssl.create_default_context()
    msg  = EmailMessage()
    msg.set_content("Welcome to Petit, your email has been verified")
    msg["Subject"]  = "Welcome to Petit"
    msg["From"] = sender
    msg["To"] = email
    try:
        with smtplib.SMTP("smtp.office365.com", port=587) as smtp:
            smtp.starttls(context=context)
            smtp.login(msg["From"], password)
            smtp.send_message(msg)
            return True
    except:
        return False
