from email.message import EmailMessage
import smtplib, ssl
from settings import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL

def send_email(to_email: str, subject: str, body: str) -> bool:
    print(f"[DEBUG] Attempting to send email to: {to_email}")
    print(f"[DEBUG] SMTP Settings - Host: {SMTP_HOST}, Port: {SMTP_PORT}, User: {SMTP_USER}")
    
    # If not configured, just log (non-blocking)
    if not SMTP_HOST or not FROM_EMAIL:
        print("[EMAIL Fallback] Would send:", to_email, subject, body[:120], "...")
        return False
    try:
        msg = EmailMessage()
        msg["From"] = FROM_EMAIL
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)
        
        print("[DEBUG] Connecting to SMTP server...")
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=8) as server:
            print("[DEBUG] Starting TLS...")
            server.starttls(context=ssl.create_default_context())
            if SMTP_USER:
                print("[DEBUG] Attempting to login...")
                server.login(SMTP_USER, SMTP_PASS)
            print("[DEBUG] Sending email...")
            server.send_message(msg)
            print("[DEBUG] Email sent successfully!")
        return True
    except Exception as e:
        print("[ERROR] Email send failed:", str(e))
        return False
