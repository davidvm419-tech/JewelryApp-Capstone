from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    # Send the CSRF token to the client so it can be included in subsequent requests
    path("api/get_session/", views.get_session, name="get_session"),

    # Landing page and products views
    path("api/catalog", views.catalog, name="catalog"),
    path("api/product/<int:product_id>", views.product_details, name="product-details"),
    path("api/images/<int:product_id>", views.images, name="images"),

    # Create, edit and delete paths
    path("api/rating/<int:product_id>", views.add_rating, name="add_rating"),
    path("api/rating/edit/<int:product_id>", views.edit_rating, name="edit_rating"),
    path("api/comment/<int:product_id>", views.add_comment, name="add_comment"),
    path("api/comment/edit/<int:product_id>", views.edit_comment, name="edit_comment"),
    path("api/comment/delete/<int:comment_id>", views.delete_comment, name="delete_comment"),
    
    # User paths (remember the ending / so react and Django communicate)
    path("api/register/", (views.register_view), name="register"),
    path("api/login/", views.login_view, name="login"),
    path("api/logout/",views.logout_view, name="logout"),
]
