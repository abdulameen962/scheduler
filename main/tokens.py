from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_api_key.permissions import HasAPIKey

class TokenView(TokenObtainPairView):
    throttle_scope = 'important'
    permission_classes = [HasAPIKey]
    
class TokenFreshView(TokenRefreshView):
    throttle_scope = 'important'
    permission_classes = [HasAPIKey]