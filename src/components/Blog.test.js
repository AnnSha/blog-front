import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen, render } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
    const blog={
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user:{
            username:'ansha'
        }
    }

    test('renders blog content', () => {
        render(<Blog blog={blog}/>)
        const element = screen.getByText('React patterns')
        screen.debug(element)
        const element1 = screen.getByText('Michael Chan')
        screen.debug(element1)
    })

    test('clicking the button controlling the shown details', async () => {

        const mockHandler = jest.fn()
        render(<Blog blog={blog} />)
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        expect(mockHandler.mock.calls).toHaveLength(1)

    })

    test('the like button is clicked twice the event handler the component is called twice', async () => {

        const likeBlog = jest.fn()
        render(<Blog blog={blog}/>)
        const user = userEvent.setup()
        const button = screen.getByText('like')
        await user.click(button)

        expect(likeBlog.mock.calls).toHaveLength(2)
    })


})

