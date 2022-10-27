import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createRef, useEffect, useState } from 'react';
import './todos.css';
import Container from '../../components/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import {
  deepCopy,
  handleError,
  removeError,
  setStateKeyVal,
} from '../../utilities';
import AlertBox from '../../components/AlertBox';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCategory } from './todosSortableCategory';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../store/reducers/userSlice';

export default function Todos() {
  const [state, updateState] = useState({});
  const [data, updateData] = useState([]);
  const categoryTextInputRef = createRef();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // get the todos data for the user
  useEffect(() => {
    if (!user.token) {
      return navigate('/login?redirect=todos', { replace: true });
    }

    let isMounted = true;

    async function getData(isMounted) {
      try {
        const { data } = await axios.get('/todos');

        if (isMounted) {
          data.forEach((categoryData) => {
            categoryData.todoTextRef = createRef();
            if (!categoryData.order && categoryData.order !== 0) {
              categoryData.order = getNewCategoryOrder(
                categoryData.category,
                data
              );
            }
            // get next order value for any todos missing it
            categoryData.todos.forEach((todo) => {
              if (!todo.order && todo.order !== 0) {
                todo.order = getNewTodoOrder(categoryData.category, data);
              }
            });

            // sort todos by order
            categoryData.todos.sort((a, b) => (a.order > b.order ? 1 : -1));
          });

          // sort categories by order
          data.sort((a, b) => (a.order > b.order ? 1 : -1));

          updateData(data);
        }
      } catch (err) {
        console.log(err);
        if (err.toString().includes('401') || err.toString().includes('403')) {
          dispatch(userLogout());
          return navigate('/login?redirect=todos', { replace: true });
        }
        handleError(err, state, updateState);
      }
    }

    getData(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  function setupRefs(dataNeedingRefs = data) {
    dataNeedingRefs.forEach((categoryData) => {
      categoryData.todoTextRef = createRef();
    });
    return dataNeedingRefs;
  }

  function removeRefs(dataToRemoveRefs = data) {
    dataToRemoveRefs.forEach((categoryData) => {
      delete categoryData.todoTextRef;
    });
    return dataToRemoveRefs;
  }

  function deepCopyData(data) {
    return setupRefs(deepCopy(removeRefs(data)));
  }

  const getDataByCategory = (category, newData) =>
    (newData || data).find((todos) => todos.category === category);

  const addCategory = async () => {
    try {
      // get category from input text and erase input field
      const category = categoryTextInputRef.current.value.trim();

      categoryTextInputRef.current.value = '';

      if (!category) {
        return;
      }

      if (getDataByCategory(category)) {
        throw new Error(`Category "${category}" already exists`);
      }

      // add category to data object, instant update on frontend
      const newData = deepCopyData(data);

      const newCategory = {
        category,
        hidden: false,
        order: getNewCategoryOrder(),
        todos: [],
      };

      newData.push(newCategory);

      updateData(newData);

      // backend decides order and returns latest data
      const result = await axios.post('/todos/category', newCategory);
      newCategory._id = result.data._id;
      updateData(deepCopyData(newData));
      removeError(state, updateState);
    } catch (err) {
      console.log(err);
      handleError(err, state, updateState);
    }
  };

  const onCategoryKeyUp = (e) => {
    if (e.charCode === 13) {
      addCategory();
    } else {
      removeError(state, updateState);
    }
  };

  const hideCategory = async (category) => {
    try {
      // un/hide all, switch the arrow
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      categoryData.hidden = !categoryData.hidden;
      updateData(newData);

      // update backend, no reloading necessary for hiding a category
      await axios.put(`/todos/category/${categoryData._id}`, {
        hidden: categoryData.hidden,
      });
      removeError(state, updateState);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const getNewCategoryOrder = (category, paramData = data) => {
    try {
      const existingOrders = paramData.map((categoryData) =>
        Number(categoryData.order)
      );

      // default to 0 if no categories
      if (!existingOrders.length) {
        existingOrders.push(-1);
      }

      return 1 + Math.max.apply(null, existingOrders);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const getNewTodoOrder = (category, categoryData) => {
    try {
      categoryData = categoryData || getDataByCategory(category);
      const existingOrders = (categoryData.todos || []).map((todo) =>
        Number(todo.order)
      );

      // default to 0 if no todos
      if (!existingOrders.length) {
        existingOrders.push(-1);
      }

      return 1 + Math.max.apply(null, existingOrders);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  // update todos list with new todo object
  const addTodo = async (category, e, ref) => {
    try {
      const target = e ? e.target : ref.current;

      if (!target) {
        throw new Error('Missing target');
      }

      const { value } = target;

      if (!value) {
        return;
      }

      // text must be unique
      const existingTodo = getDataByCategory(category).todos.find(
        (todo) => todo.text === value
      );
      if (existingTodo) {
        throw new Error(`Todo already exists with text "${existingTodo.text}"`);
      }

      // make random name for uniqueness
      const newTodo = {
        text: value,
        checked: false,
        order: getNewTodoOrder(category),
      };

      // add todo to category
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      categoryData.todos.push(newTodo);

      updateData(deepCopyData(newData));
      target.value = '';

      const result = await axios.post(
        `/todos/todo/${categoryData._id}`,
        newTodo
      );
      newTodo.id = result.data.todoId;
      updateData(newData);
      removeError(state, updateState);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const onTodoKeyUp = (e, category) => {
    if (e.charCode === 13) {
      addTodo(category, e);
    } else {
      removeError(state, updateState);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateChecked = async (category, todoIndex, e) => {
    try {
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      categoryData.todos[todoIndex].checked = e.target.checked;
      updateData(newData);

      await axios.put(
        `/todos/todo/${categoryData._id}`,
        categoryData.todos[todoIndex]
      );
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const deleteCategory = async (category) => {
    try {
      const newData = deepCopyData();
      const categoryIndex = newData.findIndex(
        (categoryData) => categoryData.category === category
      );
      const categoryId = newData[categoryIndex]._id;

      if (!categoryId) {
        throw new Error('Missing category id');
      }
      newData.splice(categoryIndex, 1);
      updateData(newData);

      await axios.delete(`/todos/category/${categoryId}`);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const deleteTodo = async (category, todoIndex) => {
    try {
      const newData = deepCopyData();
      const categoryData = getDataByCategory(category, newData);
      const todoArr = categoryData.todos.splice(todoIndex, 1);
      const todo = todoArr[0];
      updateData(newData);
      await axios.delete(`/todos/todo/${categoryData._id}/${todo.id}`);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const updateAllChecked = async (e, category, setAllChecked) => {
    try {
      setAllChecked(e.target.checked);
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      for (let i = 0; i < categoryData.todos.length; i++) {
        const todo = categoryData.todos[i];
        if (todo.checked !== e.target.checked) {
          todo.checked = e.target.checked;
          axios.put(`/todos/todo/${categoryData._id}`, todo);
        }
      }
      updateData(newData);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const shared = {
    addTodo,
    deleteCategory,
    deleteTodo,
    handleDragEndTodo,
    hideCategory,
    onTodoKeyUp,
    deepCopyData,
    data,
    updateAllChecked,
    updateChecked,
  };

  return (
    <Container>
      <div className="form-section">
        <AlertBox
          show={state.error ? true : false}
          variant="danger"
          message={(state.error && state.error.text) || state.error}
          onClick={() => setStateKeyVal(state, 'error', null, updateState)}
        />

        {/* add a new category */}
        <div className="todo-row mt-3 mb-5">
          <Form.Group className="mb-3" controlId="categoryInput">
            <Form.Control
              ref={categoryTextInputRef}
              onKeyPress={onCategoryKeyUp}
              className="inline thin-input mr-5"
              type="text"
              placeholder="enter new category"
            />
            {'  '}
            <FontAwesomeIcon
              className="inline"
              icon={faPlus}
              onClick={addCategory}
            />
          </Form.Group>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEndCategory(e)}
        >
          <SortableContext
            items={data.map((categoryData) => categoryData.order.toString())}
            strategy={verticalListSortingStrategy}
          >
            {data
              .map((categoryData) => categoryData.order)
              .sort((a, b) => a.order - b.order)
              .map((order, index) => (
                <SortableCategory
                  index={index}
                  order={order}
                  category={data[index].category}
                  key={data[index].category}
                  id={data[index].order.toString()}
                  value={data[index]}
                  shared={shared}
                />
              ))}
          </SortableContext>
        </DndContext>
      </div>
    </Container>
  );

  function handleDragEndTodo(event, category) {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }

    const newData = deepCopyData();
    let categoryData = getDataByCategory(category, newData);
    const orders = categoryData.todos.map((todo) => todo.order);
    const oldIndex = orders.indexOf(Number(active.id));
    const newIndex = orders.indexOf(Number(over.id));
    categoryData.todos = arrayMove(categoryData.todos, oldIndex, newIndex);

    for (let i = 0; i < categoryData.todos.length; i++) {
      if (categoryData.todos[i].order !== i) {
        categoryData.todos[i].order = i;
        axios.put(`/todos/todo/${categoryData._id}`, categoryData.todos[i]);
      }
    }

    updateData(newData);
  }

  function handleDragEndCategory(event) {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }

    const orders = data.map((categoryData) => categoryData.order);
    const oldIndex = orders.indexOf(Number(active.id));
    const newIndex = orders.indexOf(Number(over.id));

    let result = deepCopyData(arrayMove(data, oldIndex, newIndex));

    for (let i = 0; i < result.length; i++) {
      if (result[i].order !== i) {
        result[i].order = i;
        axios.put(`/todos/category/${result[i]._id}`, { order: i });
      }
    }
    result = JSON.parse(JSON.stringify(result));
    updateData(result);
  }
}
