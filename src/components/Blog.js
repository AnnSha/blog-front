import {useState} from "react";

const Blog = ({ blog,deleteBlog, addLike}) => {
    const [blogVisible, setBlogVisible] = useState(false)



        const hideWhenVisible = { display: blogVisible ? 'none' : '' }
        const showWhenVisible = { display: blogVisible ? '' : 'none' }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible}>
                <p> {blog.title}</p>
                <button onClick={() => setBlogVisible(true)}>view</button>
            </div>
           <div style={showWhenVisible}>
               <button onClick={()=> setBlogVisible(false)}>hide</button>
               <p> {blog.title}</p>
               <p> {blog.author}</p>
               <p>{blog.url}</p>

               <p>likes {blog.likes} <button onClick={()=>addLike(blog)}>like</button></p>
               <p>{blog.user.name}</p>
               <button onClick={() => deleteBlog(blog)}>delete</button>

           </div>
        </div>
    )}

export default Blog