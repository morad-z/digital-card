import json
import logging
import smtplib
from typing import Dict, Any
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --- SMTP CONFIGURATION ---

# Gmail SMTP server details
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Your Gmail account
SMTP_USERNAME = "urban.project.shenkar@gmail.com"

# Your Gmail App Password (example shown for clarity!)
SMTP_PASSWORD = "smtp password"

# Send from this email
SENDER_EMAIL = SMTP_USERNAME

# Send to this email
RECIPIENT_EMAIL = "urban.project.shenkar@gmail.com"

# Email subject
EMAIL_SUBJECT = "📇 New Digital Card Submission"


def send_email(payload: dict) -> None:
    """
    Send email via Gmail SMTP containing the payload as a styled HTML email.
    """
    try:
        # Extract all fields with fallback defaults
        full_name = payload.get("fullName", "(not provided)")
        phone = payload.get("phone", "(not provided)")
        email = payload.get("email", "(not provided)")
        message_text = payload.get("message", "(no message provided)")

        # HTML email body
        body_html = f"""
        <html>
          <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0073e6;">📇 New Digital Card Submission</h2>
            <p><strong>Full Name:</strong> {full_name}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
            <hr style="margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="background: #f0f0f0; padding: 10px; border-radius: 5px;">
              {message_text}
            </p>
          </body>
        </html>
        """

        # Create MIME message
        message = MIMEMultipart()
        message["From"] = SENDER_EMAIL
        message["To"] = RECIPIENT_EMAIL
        message["Subject"] = EMAIL_SUBJECT

        # Attach HTML part
        message.attach(MIMEText(body_html, "html", "utf-8"))

        logger.info("Connecting to SMTP server: %s:%d", SMTP_SERVER, SMTP_PORT)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(
                from_addr=SENDER_EMAIL,
                to_addrs=[RECIPIENT_EMAIL],
                msg=message.as_string()
            )

        logger.info("✉️ Email sent successfully via SMTP")

    except Exception as exc:
        logger.exception("❌ Failed to send email via SMTP: %s", exc)
        raise


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    try:
        logger.info("⚙️ FULL EVENT RECEIVED: %s", json.dumps(event, indent=2, ensure_ascii=False))

        # Handle both direct test event and API Gateway event
        if "body" in event and event["body"]:
            body_raw = event["body"]
            body = json.loads(body_raw)
        else:
            body = event

        if not isinstance(body, dict):
            body = {}

        logger.info("📥 Parsed Body: %s", json.dumps(body, indent=2, ensure_ascii=False))

        send_email(body)

        return _response(
            status=201,
            message="Digital card stored",
            data=body
        )

    except json.JSONDecodeError:
        logger.warning("Received malformed JSON: %s", event.get("body"))
        return _response(status=400, message="Malformed JSON in request body")

    except Exception as exc:
        logger.exception("Unhandled exception: %s", exc)
        return _response(status=500, message="Internal server error")

def _response(*, status: int, message: str, data: Any | None = None) -> Dict[str, Any]:
    """
    Format HTTP response for API Gateway.
    """
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,x-api-key",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        "body": json.dumps({
            "message": message,
            **({"data": data} if data is not None else {}),
        }),
    }
