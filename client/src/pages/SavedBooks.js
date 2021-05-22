import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { QUERY_GETME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
// import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data, refetch } = useQuery(QUERY_GETME);
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);
  const [userData, setUserData] = useState({});
  const [toggle, setToggle] = useState(false);

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  
  refetch();
  useEffect(() => {
    const getUserData = async () => {
      try {

        if (!loading) {
          setUserData(data.getMe);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength, loading]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // const token = Auth.loggedIn() ? Auth.getToken() : null;

    try {
      const { data } = await deleteBook({ variables: {bookId: bookId } });

      if (!loading) {
        setUserData(data.deleteBook);
        removeBookId(bookId);
        refetch();
      }

    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
