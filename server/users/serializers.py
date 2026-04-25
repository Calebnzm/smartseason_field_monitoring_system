from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

import uuid
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail

def send_invitation_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    invite_url = f"http://127.0.0.1:8000/api/auth/complete-invite/?uid={uid}&token={token}"
    
    send_mail(
        subject="You've been invited to SmartSeason!",
        message=f"Hello {user.first_name},\n\nPlease set up your account by using the link below:\n\n{invite_url}\n\nThanks!",
        from_email="admin@smartseason.com",
        recipient_list=[user.email],
        fail_silently=False,
    )

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User(
            username=f"user_{uuid.uuid4().hex[:10]}",
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role='AGENT',
            is_active=False
        )
        user.set_unusable_password()
        user.save()
        send_invitation_email(user)
        return user

class AgentProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User(
            username=f"admin_{uuid.uuid4().hex[:10]}",
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role='ADMIN',
            is_staff=True,
            is_active=False
        )
        user.set_unusable_password()
        user.save()
        send_invitation_email(user)
        return user

class CompleteInviteSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_username = serializers.CharField(max_length=150)
    new_password = serializers.CharField(write_only=True)
