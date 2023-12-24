from rest_framework_api_key.permissions import HasAPIKey
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .bert import BERT_AI
# from .models import Goal,Task,Notification
# from .serializers import GoalSerializer,NotificationSerializer,TaskSerializer

class NEXT_WORD(APIView):
    permission_classes = [HasAPIKey,IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def post(self,request):
        try:
            data = request.data
            sentence = data.get("sentence",None)
            word = data.get("word",None)
            word = int(word) if word is not None else word
            if sentence is None or word is None:
                return Response({"message":"Sentence and word are required"},status=status.HTTP_400_BAD_REQUEST)
            
            bert = BERT_AI(word)
            next_word = bert.predict_next_word(sentence)
            return Response({"word":next_word},status=status.HTTP_200_OK)
        
        except Exception:
            return Response({"message":"Something went wrong"},status=status.HTTP_400_BAD_REQUEST)