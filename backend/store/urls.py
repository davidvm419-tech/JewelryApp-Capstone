from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    # Send the CSRF token to the client so it can be included in subsequent requests
    path("api/get-csrf-token/", views.get_csrf_token, name="get_csrf"),
    
    # User paths (remember the ending / so react and Django communicate)
    path("api/register/", (views.register_view), name="register"),
    path("api/login/", views.login_view, name="login"),
    path("api/logout/",views.logout_view, name="logout"),
]
