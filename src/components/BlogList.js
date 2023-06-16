import Blog from './Blog'

const BlogList=({ blogs, addLike,deleteBlog, user }) => {
    const sortBlogs= blogs.sort((a, b) => (b.likes- a.likes))
    return (
        <div>
            {sortBlogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    addLike={addLike}
                    deleteBlog={() => deleteBlog(blog, user)}
                    user={user}

                />
            )}

        </div>
    )


}

export default BlogList