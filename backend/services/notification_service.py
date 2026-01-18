import logging
from typing import List, Dict

class NotificationService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def send_email(self, recipient: str, subject: str, body: str) -> bool:
        """
        Send an email notification.
        """
        # In production, use SMTP or SendGrid/AWS SES
        self.logger.info(f"[EMAIL] To: {recipient} | Subject: {subject} | Body: {body[:50]}...")
        return True

    def send_sms(self, phone_number: str, message: str) -> bool:
        """
        Send an SMS notification.
        """
        # In production, use Twilio etc.
        self.logger.info(f"[SMS] To: {phone_number} | Message: {message}")
        return True

    def notify_donor_match(self, donor: Dict, request_info: Dict):
        """
        Notify a donor about a potential match.
        """
        subject = "Urgent: Potential Donation Match Found"
        body = (f"Dear {donor.get('name')},\n\n"
                f"A patient requires a {request_info.get('organ')} transplant that matches your profile.\n"
                f"Urgency: {request_info.get('urgency')}.\n"
                f"Please login to the portal to review details.")
        
        # Prefer email, fallback to SMS or do both
        if donor.get('email'):
             self.send_email(donor.get('email'), subject, body)
        if donor.get('phone'):
             self.send_sms(donor.get('phone'), f"SmartDonation: Match found for {request_info.get('organ')}. Please check app.")
