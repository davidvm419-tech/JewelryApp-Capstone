from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from django.utils.html import format_html
from .models import (User, Category, Product, ProductImage, 
Comment, Rating, Wishlist, CartItem, Order, OrderItem)

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")

class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "category", "description", 
        "quantity", "materials", "price", "created_at", "updated_at")
    
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "image_tag", "alt_text")
    # Display image miniature on the admin panel
    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" />', obj.image.url)
        return "No image"
    image_tag.short_description = "Preview"

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "comment", "created_at")

class RatingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "rating", "created_at")

class WishlistAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "added_at")

class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "quantity", "added_at")

class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_price", "created_at")

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity", "price_at_purchase","added_at")

admin.site.register(User, UserAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Wishlist, WishlistAdmin)
admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)