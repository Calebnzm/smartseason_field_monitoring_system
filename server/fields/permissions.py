from rest_framework import permissions

class IsAdminOrAssignedAgent(permissions.BasePermission):
    """
    Admins can do anything.
    Agents can only view and update fields they are assigned to.
    """

    def has_permission(self, request, view):
        # We need authentication for everything in the fields app
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Admin or superuser can access any field
        if request.user.is_superuser or request.user.role == 'ADMIN':
            return True

        # Agent can only access fields assigned to them
        if request.user.role == 'AGENT':
            if hasattr(obj, 'assigned_agent'):
                return obj.assigned_agent == request.user
            elif hasattr(obj, 'field'):
                return obj.field.assigned_agent == request.user
            
        return False
