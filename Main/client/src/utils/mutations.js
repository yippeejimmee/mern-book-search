import { gql } from '@apollo/client'

export const ADD_USER = gql`
    mutation addUser($username: String!, $password: String!, $email: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`

export const SAVE_BOOK = gql`
    mutation saveBook($storedBooks: savedBooks!) {
        saveBook(bookSaved: $storedBooks) {
            _id
            username
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password)
            token
            user {
                _id
                username
            }
    }
`