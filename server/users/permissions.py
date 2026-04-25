from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """Allows access to Admin users only (and Superusers)"""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == "ADMIN" or request.user.is_superuser))

class IsAgent(permissions.BasePermission):
    """Allows access to Agent users only"""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "AGENT")

class IsSuperUser(permissions.BasePermission):
    """Allows access only to Superusers"""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)

        