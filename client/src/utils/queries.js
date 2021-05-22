import gql from 'graphql-tag';

export const QUERY_GETME = gql`
  query {
    getMe {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
      bookCount
    }
  }
`;