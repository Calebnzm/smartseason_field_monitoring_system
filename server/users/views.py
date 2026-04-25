from rest_framework.decorators import permission_classes
from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from .serializers import AgentSerializer, AdminSerializer, AgentProfileUpdateSerializer, CompleteInviteSerializer
from .permissions import IsAdmin, IsSuperUser

User = get_user_model()

class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = AgentSerializer

    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.filter(role='AGENT')

class AdminViewSet(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    permission_classes = [IsSuperUser]

    def get_queryset(self):
        return User.objects.filter(role='ADMIN')

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = AgentProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CompleteInviteView(generics.GenericAPIView):
    serializer_class = CompleteInviteSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_username = serializer.validated_data['new_username']
        new_password = serializer.validated_data['new_password']
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)
            
        if default_token_generator.check_token(user, token):
            user.username = new_username
            user.set_password(new_password)
            user.is_active = True
            user.save()
            return Response({"message": "Account successfully set up!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid or expired link"}, status=status.HTTP_400_BAD_REQUEST)
