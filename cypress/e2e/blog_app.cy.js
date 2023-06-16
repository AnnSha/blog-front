describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Anna Sha',
            username: 'ansha',
            password: 'aaaaaaaa'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('Blogs')
        cy.contains('Blog app, Department of Computer Science, University of Helsinki 2023')
    })

    it('login form can be opened', function() {
        cy.contains('log in').click()
    })
    it('user can log in', function() {
        cy.contains('log in').click()
        cy.get('#username').type('ansha')
        cy.get('#password').type('aaaaaaaa')
        cy.get('#login-button').click()

        cy.contains('Anna Sha logged in')
    })
    it('user can log in wrong', function() {
        cy.contains('log in').click()
        cy.get('#username').type('ansha')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()

        cy.get('.error')
            .should('contain', 'wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.contains('Anna Sha logged in').should('not.exist')
    })


    describe('when logged in', function() {
        beforeEach(function () {
            // cy.contains('log in').click()
            // cy.get('#username').type('ansha')
            // cy.get('#password').type('aaaaaaaa')
            // cy.get('#login-button').click()
            cy.login({ username: 'ansha', password: 'aaaaaaaa' })
        })

        it('a new blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('js')
            cy.get('#author').type('Anna')
            cy.get('#url').type('local')
            cy.contains('save').click()
            cy.contains('js')
        })


        describe('and several blog exist', function () {
            beforeEach(function () {
                cy.createBlog({ title: 'first', author: 'author1', url:'url1', likes:0 })
                cy.createBlog({ title: 'second', author: 'author2', url:'url2', likes:2 })
                cy.createBlog({ title: 'third', author: 'author3', url:'url3', likes:3 })
            })

            it('add likes', function () {
                cy.contains('first').parent().find('button').as('theButton')
                cy.get('@theButton').contains('like:0').click()
                cy.get('@theButton').should('contain', 'like:1')
            })

            it('blogs are sorted by likes', function () {
                cy.get('.blogLike').then(function (blogLike) {
                    cy.wrap(blogLike[0]).contains('third')
                    cy.wrap(blogLike[1]).contains('second')
                    cy.wrap(blogLike[2]).contains('first')
                })
            })
            it('user can remove blog', function () {
                cy.contains('second').as('blog')
                cy.get('@blog').find('delete').click()
                cy.should('not.contain', 'second')
            })

        })


    })


})