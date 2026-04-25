from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLES = (
        ('ADMIN', 'admin'),
        ('AGENT', 'agent')
    )

    role = models.CharField(max_length=10, choices=ROLES, default='AGENT')

    def __str__(self):
        return f"{self.username} ({self.role})"

