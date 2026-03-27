from django.core.paginator import Paginator

# Function to paginate a specific page of an object
def paginate(pagination_object, page_number, items_per_page):
        # Products per page
    paginator = Paginator(pagination_object, items_per_page)
    
    # Get page number

    page_obj = paginator.get_page(page_number)

    # Pass valid or invalid page
    if page_obj.has_next():
        next_page = page_obj.next_page_number()
    else:
        next_page = None

    if page_obj.has_previous():
        prev_page = page_obj.previous_page_number()
    else:
        prev_page = None

    return page_obj, {
                "total_pages": paginator.num_pages,
                "current_page": page_obj.number,
                "has_previous": page_obj.has_previous(),
                "has_next": page_obj.has_next(),
                "next_page": next_page,
                "prev_page": prev_page,
            }