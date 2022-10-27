import { Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createRef, useEffect, useState } from 'react';
import './notes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  // deepCopy,
  handleError,
  // removeError,
  setStateKeyVal,
} from '../../utilities';
import AlertBox from '../../components/AlertBox';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../store/reducers/userSlice';
import { SortableCategory } from './notesSortableCategory';

/*
a note is like this:
{
  createdAt, updatedAt, category, title, note
}
*/

export default function Notes() {
  const [state, updateState] = useState({});
  const [data, updateData] = useState([]);
  const navigate = useNavigate();
  const categoryTextInputRef = createRef();
  const titleTextInputRef = createRef();
  const noteTextInputRef = createRef();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // get the data for the user
  useEffect(() => {
    if (!user.token) {
      return navigate('/login?redirect=notes', { replace: true });
    }

    let isMounted = true;

    async function getData(isMounted) {
      try {
        const { data = [] } = await axios.get('/notes');
        if (isMounted) {
          // sort by order
          data.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
          updateData(data);
        }
      } catch (err) {
        console.log(err);
        if (err.toString().includes('401') || err.toString().includes('403')) {
          dispatch(userLogout());
          return navigate('/login?redirect=notes', { replace: true });
        }
        handleError(err, state, updateState);
      }
    }

    getData(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  // todo: where do we need refs
  // function setupRefs(noRefData = data) {
  //   // noRefData.forEach((categoryData) => {
  //   //   categoryData.todoTextRef = createRef();
  //   // });
  //   return noRefData;
  // }

  // todo: where do we need refs
  // function removeRefs(refData = data) {
  //   // refData.forEach((categoryData) => {
  //   //   delete categoryData.todoTextRef;
  //   // });
  //   return refData;
  // }

  // function deepCopyData(data) {
  //   return setupRefs(deepCopy(removeRefs(data)));
  // }

  function onCategoryInputKeyUp() {}
  function onTitleInputKeyUp() {}
  function onNoteInputKeyUp() {}
  function addNote() {}

  const shared = {
    data,
  };

  return (
    <Container className="vertical-padding-40">
      <div className="form-section" id="health-container">
        <AlertBox
          show={state.error ? true : false}
          variant="danger"
          message={(state.error && state.error.text) || state.error}
          onClick={() => setStateKeyVal(state, 'error', null, updateState)}
        />

        {/* add a new category */}
        <div className="note-row mt-3 mb-5">
          <Form.Group className="mb-3" controlId="noteInput">
            <Form.Control
              ref={categoryTextInputRef}
              onKeyPress={onCategoryInputKeyUp}
              className="inline thin-input mr-5"
              type="text"
              placeholder="enter category"
            />
            {'  '}
            <Form.Control
              ref={titleTextInputRef}
              onKeyPress={onTitleInputKeyUp}
              className="inline thin-input mr-5"
              type="text"
              placeholder="enter title"
            />
            {'  '}
            <Form.Control
              ref={noteTextInputRef}
              onKeyPress={onNoteInputKeyUp}
              className="inline thin-input mr-5"
              type="text"
              placeholder="enter note"
            />
            {'  '}
            <FontAwesomeIcon
              className="inline"
              icon={faPlus}
              onClick={addNote}
            />
          </Form.Group>
        </div>
        {data
          .map((categoryData) => categoryData.order)
          .sort((a, b) => a.order - b.order)
          .map((order, index) => (
            <SortableCategory
              index={index}
              order={order}
              category={data[index].category}
              key={data[index]._id}
              id={data[index].order.toString()}
              value={data[index]}
              shared={shared}
            />
          ))}
      </div>
    </Container>
  );
}
