/*

allow rename of categories
warn before deleting category
allow checkbox for new todo to be recurring or not

*/
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { createRef, useEffect, useState } from "react";
import './todos.css';
import Container from '../../components/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import { deepCopy, handleError, removeError, setStateKeyVal } from '../../utilities';
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
import {SortableCategory} from './todosSortableCategory';
import { useSelector } from 'react-redux';

export default function Todos () {
  const [state, updateState] = useState({});
  const [data, updateData] = useState([]);
  const categoryTextInputRef = createRef();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  // get the todos data for the user
  useEffect(() => {
    // todo: uncomment to help enforce auth
    // if (!user.token) {
    //   return navigate('/', { replace: true });
    // }

    let isMounted = true;

    async function getData(isMounted) {
      try {
        const { data } = await axios.get('/todos');

        console.log('axios get data:', data);
        if (isMounted) {
          data.forEach((categoryData) => {
            categoryData.todoTextRef = createRef()
          });
          updateData(data);
        }
      } catch (err) {
        handleError(err, state, updateState);
      }
    }

    getData(isMounted);

    return () => {
      isMounted = false;
    }
  }, []);

  function setupRefs(noRefData = data) {
    console.log('noRefData:', noRefData)
    noRefData.forEach((categoryData) => {
      categoryData.todoTextRef = createRef();
    });
    console.log('noRefData complete:', noRefData)
    return noRefData;
  }

  function removeRefs(refData = data) {
    refData.forEach((categoryData) => {
      delete categoryData.todoTextRef;
    });
    return refData;
  }

  function deepCopyData(data) {
    return setupRefs(deepCopy(removeRefs(data)));
  }

  const getDataByCategory = (category, newData) => (newData || data).find((todos) => todos.category === category);

  const addCategory = async () => {
    try {
      // get category from input text and erase input field
      const category = categoryTextInputRef.current.value;
      categoryTextInputRef.current.value = '';

      // add category to data object
      if (category && !getDataByCategory(category)) {
        // instant update
        const newData = deepCopyData(data);
        newData.push({
          category,
          hidden: false,
          order: getNewCategoryOrder(),
          todos: []
        });

        updateData(newData)

        // backend decides order and returns latest data
        const { data: responseData } = await axios.post('/todos/category', { category });

        console.log('responseData:', responseData);
        setupRefs(responseData);
        console.log('done with refs')
        updateData(responseData);
      }
      removeError(state, updateState);
    } catch (err) {
      console.log(err)
      handleError(err, state, updateState);
    }
  }

  const onCategoryKeyUp = (e) => {
    if (e.charCode === 13) {
      addCategory();
    } else {
      removeError(state, updateState);
    }
  }

  const hideCategory = async (category) => {
    try {
      // un/hide all, switch the arrow
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      categoryData.hidden = !categoryData.hidden;
      updateData(newData);

      // update backend, no reloading necessary for hiding a category
      await axios.put('/todos/category', { category, hidden: categoryData.hidden });
      removeError(state, updateState);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const getNewCategoryOrder = (category) => {
    try {
      const existingOrders = data.map((categoryData) => Number(categoryData.order));

      // default to 0 if no categories
      if (!existingOrders.length) {
        existingOrders.push(-1);
      }

      return 1 + Math.max.apply(null, existingOrders);
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const getNewTodoOrder = (category) => {
    try {
      const categoryData = getDataByCategory(category);
      const existingOrders = (categoryData.todos || []).map((todo) => Number(todo.order));

      // default to 0 if no todos
      if (!existingOrders.length) {
        existingOrders.push(-1);
      }

      return 1 + Math.max.apply(null, existingOrders);
    } catch (err) {
      handleError(err, state, updateState)
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
      const existingTodo = getDataByCategory(category).todos.find((todo) => todo.text === value);
      if (existingTodo) {
        throw new Error(`Todo already exists with text "${existingTodo.text}"`);
      }

      // make random name for uniqueness
      const newTodo = { name: Math.random(), text: value, checked: false, order: '' + getNewTodoOrder(category) };

      // add todo to category
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      categoryData.todos.push(newTodo);

      updateData(newData);
      target.value = '';

      console.log('posting new todo:', newTodo);
      await axios.post('/todos/todo', { todo: newTodo });
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
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateChecked = async (category, todoIndex, e) => {
    try {
      console.log('update checked starts')
      const newData = deepCopyData(data);
      const categoryData = getDataByCategory(category, newData);
      categoryData.todos[todoIndex].checked = e.target.checked;
      console.log('newData:', newData)
      updateData(newData);

      await axios.put('/todos/todo', { category, todo: categoryData.todos[todoIndex] });
    } catch (err) {
      handleError(err, state, updateState)
    }
  };
  
  const deleteCategory = async (category) => {
    try {
      const newData = deepCopyData();
      const categoryIndex = newData.findIndex((categoryData) => categoryData[category] === category);
      delete newData[categoryIndex];
      updateData(newData);
      await axios.delete('/todos/category', { category });
    } catch (err) {
      handleError(err, state, updateState);
    }
  };

  const deleteTodo = async (category, todoIndex) => {
    try {
      const newData = deepCopyData();
      const categoryData = getDataByCategory(category, newData);
      const todo = categoryData.todos[todoIndex];
      categoryData.todos.splice(todoIndex, 1);
      updateData(newData);
      await axios.delete('/todos/todo', { category, todoId: todo._id });
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
    updateChecked,
  };

  return (
    <Container>
    <div className="form-section" id="health-container">

      <AlertBox
        show={state.error ? true : false}
        variant="danger"
        message={(state.error && state.error.text) || state.error}
        onClick={() => setStateKeyVal(state, 'error', null, updateState)}
      />

      {/* add a new category */}
      <div className="todo-row mt-3 mb-5">
        <Form.Group className="mb-3" controlId="categoryInput">
          <Form.Control ref={categoryTextInputRef} onKeyPress={onCategoryKeyUp} className="inline thin-input mr-5" type="text" placeholder="enter new category" />{'  '}
          <FontAwesomeIcon className="inline" icon={faPlus} onClick={addCategory}/>
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
          {data.map((categoryData) => categoryData.order).sort((a, b) => a.order - b.order).map((order, index) => <SortableCategory index={index} order={order} category={data[index].category} key={data[index].category} id={data[index].order.toString()} value={data[index]} shared={shared} />)}
        </SortableContext>
      </DndContext>
    </div>
    </Container>
  );
  
  function handleDragEndTodo(event, category) {
    const {active, over} = event;
    if (active.id !== over.id) {
      const newData = deepCopyData();
      let categoryData = getDataByCategory(category, newData);
      const orders = categoryData.todos.map((todo) => todo.order);
      const oldIndex = orders.indexOf(Number(active.id));
      const newIndex = orders.indexOf(Number(over.id));
      categoryData.todos = arrayMove(categoryData.todos, oldIndex, newIndex);
      updateData(newData);
    }
  }

  function handleDragEndCategory (event) {
    const {active, over} = event;
    console.log('handleDragEndCategory:', active, 'over:', over)
    if (active.id !== over.id) {
      const orders = data.map((categoryData) => categoryData.order);
      const oldIndex = orders.indexOf(Number(active.id));
      const newIndex = orders.indexOf(Number(over.id));
      console.log('oldIndex:', oldIndex, 'newIndex:', newIndex)
      let result = deepCopyData(arrayMove(data, oldIndex, newIndex));
      console.log('result:', result);
      result = JSON.parse(JSON.stringify(result));
      updateData(result);
      console.log('data:', data);
    }
  }
}

