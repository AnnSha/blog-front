
import './App.css'
import { useState, useEffect, useRef } from 'react'

import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Footer from './components/Footer'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
const App = () => {
    const [blogs, setBlogs] = useState([])
    const [info, setInfo] = useState(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)


    useEffect(() => {
        blogService
            .getAll()
            .then(blogs =>
                setBlogs( blogs )
            )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
        window.localStorage.clear()

    }, [])

    const blogFormRef = useRef()

    const newMessage = (message, type='') => {
        setInfo({ message, type })
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
            newMessage('Wrong username or password', 'error')

        }
    }
    const handleLogout=(event) => {
        event.preventDefault()
        localStorage.clear()

        blogService.setToken(user.token)
        setUser(null)
        setUsername('')
        setPassword('')
    }


    const addBlog = (blogObject) => {
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                // Create a new blog object that includes the user data
                const newBlog = {
                    ...returnedBlog,
                    user: user  // 'user' is the current user data
                }

                newMessage(`Added new blog: '${blogObject.title}' author: ${blogObject.author}`, 'info')
                setBlogs(blogs.concat(newBlog))
                blogFormRef.current.toggleVisibility()
            })
    }
    const addLike = blog => {

        blogService
            .update(blog.id, { likes: blog.likes+1 })
            .then(() => {
                setBlogs(blogs.map(bl => bl.id !== blog.id ? bl : { ...blog, likes: blog.likes + 1 }))
            })
            .catch(() => {
                newMessage(
                    `Blog '${blog.title}' was already removed from server`, 'error'
                )
                setBlogs(blogs.filter(b => b.id !== blog.id))
            })
    }


    // const deleteBlog = ((blog) => {
    //     if (window.confirm(`Are you sure? Delete '${blog.title}'?`)) {
    //         blogService
    //             .remove(blog.id)
    //             .then(() => {
    //                 newMessage( `Deleted '${blog.title}'`, 'info')
    //                 setBlogs(blogs.filter(b => b.id !== blog.id));
    //             })
    //     }
    // })

    const deleteBlog = (blog, user) => {
        console.log('Blog:', blog)
        console.log('User:', user)
        if (blog.user.username  === user.username) {
            if (window.confirm(`Are you sure? Delete '${blog.title}'?`)) {
                blogService
                    .remove(blog.id)
                    .then(() => {
                        newMessage(`Deleted '${blog.title}'`, 'info')
                        setBlogs(blogs.filter((b) => b.id !== blog.id))
                    })
                    .catch((error) => {
                        newMessage(`Error deleting blog: ${error.message}`, 'error')
                    })
            }
        }
        else {
            newMessage('You don\'t have permission to delete this blog.', 'error')
        }
    }

    // const loginForm = () => (
    //     <form onSubmit={handleLogin}>
    //       <div>
    //         username
    //         <input
    //             type="text"
    //             value={username}
    //             name="Username"
    //             onChange={({ target }) => setUsername(target.value)}
    //         />
    //       </div>
    //       <div>
    //         password
    //         <input
    //             type="password"
    //             value={password}
    //             name="Password"
    //             onChange={({ target }) => setPassword(target.value)}
    //         />
    //       </div>
    //       <button type="submit">login</button>
    //     </form>
    // )

    return (
        <div className='App'>
            <h2>Blog App</h2>
            <Notification info={info} />

            <h4>User</h4>
            {/*{!user && loginForm()}*/}
            {!user &&
              <Togglable buttonLabel="log in">
                  <LoginForm
                      username={username}
                      password={password}
                      handleUsernameChange={({ target }) => setUsername(target.value)}
                      handlePasswordChange={({ target }) => setPassword(target.value)}
                      handleSubmit={handleLogin}
                  />
              </Togglable>
            }

            {user &&
              <div>
                  <p>{user.name} logged in to application
                      <button onClick={handleLogout} >Logout</button>
                  </p>
                  <Togglable buttonLabel ='new blog' ref={blogFormRef}>
                      <BlogForm createBlog={addBlog}  user={user}/>
                  </Togglable>
              </div>
            }
            <h4>Blogs</h4>
            <BlogList blogs={blogs} user={user} deleteBlog={deleteBlog} addLike={addLike} />

            <Footer />

        </div>
    )
}

export default App


//  "proxy": "http://localhost:3003"