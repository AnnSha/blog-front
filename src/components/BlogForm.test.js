import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const input1 = screen.getByPlaceholderText('write title')
    const input2 = screen.getByPlaceholderText('write author')
    const input3 = screen.getByPlaceholderText('write url')
    const sendButton = screen.getByText('save')

    await user.type(input1, 'testing a title...')
    await user.type(input2, 'testing a author...')
    await user.type(input3, 'testing a url...')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].content).toBe({
        title:'testing a title...',
        author: 'testing a author',
        url: 'testing a url'
    })
})