from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    # Send the CSRF token to the client so it can be included in subsequent requests 
    # and add data of user if is authenticated
    path("api/get_session/", views.get_session, name="get_session"),

    # Landing page and products views
    path("api/catalog", views.catalog, name="catalog"),
    path("api/catalog/<int:category_id>", views.catalog, name="catalog"),
    path("api/product/<int:product_id>", views.product_details, name="product-details"),
    path("api/images/<int:product_id>", views.images, name="images"),
    path("api/categories", views.store_categories, name="store_categories"),

    # Create, edit and delete comments and ratings
    path("api/rating/<int:product_id>", views.add_rating, name="add_rating"),
    path("api/rating/edit/<int:product_id>", views.edit_rating, name="edit_rating"),
    path("api/comment/<int:product_id>", views.add_comment, name="add_comment"),
    path("api/comment/edit/<int:product_id>", views.edit_comment, name="edit_comment"),
    path("api/comment/delete/<int:comment_id>", views.delete_comment, name="delete_comment"),

    # Create and delete products from wishlist and shopping cart
    path("api/wishlist/add/<int:product_id>", views.add_to_wishlist, name="add_to_wishlist"),
    path("api/wishlist/delete/<int:wishlist_item_id>",views.delete_from_wishlist, name="delete_from_wishlist"),
    path("api/cart/add/<int:product_id>", views.add_to_cart, name="add_to_cart"),
    path("api/cart/update/<int:product_id>/<str:quantity_change>", views.update_cart, name="add_to_cart"),
    path("api/cart/delete/<int:cart_item_id>", views.delete_from_cart, name="delete_from_cart"),

    # User paths 
    path("api/register", (views.register_view), name="register"),
    path("api/login", views.login_view, name="login"),
    path("api/buy", views.buy_view, name="buy_view"),
    path("api/orders", views.user_orders, name="user_orders"),
    path("api/user/settings", views.user_settings, name="user_settings"),
    path("api/user/updateDetails", views.details_update, name="details_update"),
    path("api/user/updateEmail", views.email_update, name="email_update"),
    path("api/user/updatePassword", views.password_update, name="password_update"),
    path("api/logout/",views.logout_view, name="logout"),
]
