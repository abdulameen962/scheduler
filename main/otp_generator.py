import pyotp
from datetime import datetime,timedelta

class Otp_manager():
    
    def __init__(self,interval:int):
        self.interval = interval
        self.minutes = self.interval / 60
    
    def generate_otp(self,request):
        """
        Generates and returns an otp based on the interval
        """
        
        totp = pyotp.TOTP(pyotp.random_base32(),interval=self.interval)
        otp = totp.now()
        
        request.session["otp_secret_key"] = totp.secret
        valid_date = datetime.now() + timedelta(minutes=self.minutes)
        request.session["otp_valid_date"] = str(valid_date)
        request.session['otp_validation'] = False
        
        return otp
    
    def validate_otp(self,request,otp):
        """
            Validates whethere otp sent is correct or no
        """
        otp_secret_key = request.session["otp_secret_key"]
        otp_valid_date = request.session["otp_valid_date"]
        
        if otp_secret_key and otp_valid_date is not None:
            valid_date = datetime.fromisoformat(otp_valid_date)
            
            if valid_date > datetime.now():
                totp = pyotp.TOTP(otp_secret_key,interval=self.interval)
                if totp.verify(otp):
                    del request.session["otp_secret_key"]
                    del request.session["otp_valid_date"]
                    request.session['otp_validation'] = True
                    
                    
                    return True
                
        
        return False
        