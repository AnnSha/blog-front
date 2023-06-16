import { useState } from 'react'


const BlogForm = ({ createBlog, user }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')


    const addBlog = (event) => {
        event.preventDefault()

        createBlog({
            title: title,
            author: author,
            url: url,
            likes: 0,
            user: user


        })
        setTitle('')
        setAuthor('')
        setUrl('')


    }


    return(
        <div>

            <form onSubmit={addBlog}>
                <div>
            title
                    <input
                        id='title'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        placeholder='write title'
                    />
                </div>
                <div>
            author
                    <input
                        id='author'
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                        placeholder='write author'
                    />
                </div>
                <div>
            url
                    <input
                        id='url'
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        placeholder='write url'
                    />
                </div>


                <button id='save-button' type="submit">save</button>

            </form>
        </div>
    )
}
export default BlogForm