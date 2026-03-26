function Pagination({pagination, setPage}) {
    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <div className="flex gap-4">
                <button className="px-4 py-2 rounded-lg text-sm font-medium border border-[#1B3A57] text-[#1B3A57] 
                hover:bg-[#1B3A57] hover:text-white transition-colors duration-200 
                disabled:opacity-40 disabled:pointer-events-none"
                disabled={!pagination.has_previous} onClick={() => setPage(pagination.prev_page)}>
                    Previous
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-medium border border-[#1B3A57] text-[#1B3A57] 
                hover:bg-[#1B3A57] hover:text-white transition-colors duration-200 
                disabled:opacity-40 disabled:pointer-events-none"
                disabled={!pagination.has_next} onClick={() => setPage(pagination.next_page)}>
                    Next
                </button>
            </div>
            <div className="inline-flex">
                <span className="text-sm text-[#1B3A57] mt-1">
                    Showing <span className="font-semibold">{pagination.current_page}</span> of
                    <span className="font-semibold"> {pagination.total_pages}</span> pages
                </span>
            </div>
        </div>
    )
}

export default Pagination