function ProductComments({comments, userId}) {
    return (
        <div className="comments">
            {comments.length <= 0 ? <p>No comments added yet!</p> : comments.map(comment => (
                <div key={comment.id} className="comments content">
                    <p>{comment.username}</p>
                    <p>{comment.comment}</p>
                    <small>Commented at: {comment.created_at}</small>
                </div>
            ))}
        </div>
    )
}

export default ProductComments;