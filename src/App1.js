
import './App.css';

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from "./components/Notification";
import blogService from './services/blogs'
import loginService from './services/login'
import Footer from "./components/Footer";

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [info, setInfo] = useState(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)


    useEffect(() => {
        blogService.getAll()
            .then(blogs =>
                setBlogs( blogs )
            )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)

        }
        window.localStorage.clear()

    }, [])
    const newMessage=(message, type='')=>{
        setInfo({message, type})
        setTimeout(() => {
            setInfo(  null)
        }, 3000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            blogService.setToken(user.token)

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            newMessage(`Wrong username or password`, 'error')

        }
    }
    const handleLogout=(event) =>{
        event.preventDefault()
        localStorage.clear()


        blogService.setToken(user.token)
        setUser(null)
        setUsername('')
        setPassword('')
    }

    const addBlog = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target)
        const blogObject = {
            title: title,
            author: author,
            url: url

        }
        blogService
            .create(blogObject)
            .then(returnedBlog=>{
                newMessage( `Added new blog: '${title}' author: ${author}`, 'info')
                setBlogs(blogs.concat(returnedBlog))
                setTitle('')
                setAuthor('')
                setUrl('')
            })
    }


    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const blogForm = () => (
        <form onSubmit={addBlog}>
            <div>
                title
                <input
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    value={url}
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">save</button>
        </form>
    )




    return (
        <div >
            <h2>Blog App</h2>
            <Notification info={info} />

            <h4>User</h4>
            {!user && loginForm()}
            {user && <div>
                <p>{user.name} logged in to application
                    <button onClick={handleLogout} >Logout</button>

                </p>

                {blogForm()}
            </div>
            }
            <h4>Blogs</h4>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
            <Footer />

        </div>
    )
}

export default App


//  "proxy": "http://localhost:3003"