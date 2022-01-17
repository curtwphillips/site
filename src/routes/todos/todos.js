/*

allow rename of categories
warn before deleting category
allow checkbox for new todo to be recurring or not

*/
import { createRef, useState } from "react";
import './todos.css';
import Container from '../../components/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import data from '../../data/todoData';

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

export default function Todos () {
  const [todos, updateTodos] = useState(data);
  const [hiddenCategories, updateHiddenCategories] = useState({});
  const [todoCategories, updateTodoCategories] = useState(Object.keys(todos).sort());
  const todoTextRefs = {};
  todoCategories.forEach((category) => todoTextRefs[category] = createRef());

  const categoryTextInput = createRef();

  const addCategory = () => {
    // get category from input text
    const category = categoryTextInput.current.value;

    // add category to data object
    if (category && !todos[category]) {
      console.log('update todos')
      const newTodos = safeCopyTodos();
      // capitalize first letter
      const formattedCategory = category[0].toUpperCase() + category.substring(1);
      newTodos[formattedCategory] = [];
      console.log('newTodos:', newTodos)
      updateTodos(newTodos);
      const newTodoCategories = [...todoCategories];
      newTodoCategories.push(formattedCategory);
      updateTodoCategories(newTodoCategories);
    }
    categoryTextInput.current.value = '';
  }

  const onCategoryKeyUp = (e) => {
    if (e.charCode === 13) {
      addCategory();
    }
  }

  const hideCategory = (category) => {
    // un/hide all, switch the arrow
    const newHiddenCategories = {...hiddenCategories};
    newHiddenCategories[category] = !newHiddenCategories[category];
    updateHiddenCategories(newHiddenCategories);
  };

  const getTodoOrder = (category) => {
    const existingOrders = todos[category].map((todo) => Number(todo.order));
    if (!existingOrders.length) {
      existingOrders.push(-1);
    }
    console.log('result1:', existingOrders)
    console.log('final result:', 1 + Math.max.apply(null, existingOrders))
    return 1 + Math.max.apply(null, existingOrders);
  };

  const addTodo = (category, e, ref) => {
    console.log('start addTodo')
    const target = e ? e.target : ref.current;
    console.log('target:', target)
    const { value } = target;
    console.log('value:', value)
    if (!value) {
      return;
    }
    const newTodo = { name: Math.random(), text: value, checked: false, order: '' + getTodoOrder(category) };

    // add todo to category
    const newTodos = safeCopyTodos();
    newTodos[category].push(newTodo);
    // set checked value
    updateTodos(newTodos);
    target.value = '';
  };
 
  const onTodoKeyUp = (e, category) => {
    if (e.charCode === 13) {
      addTodo(category, e);
    }
  }

  const safeCopyTodos = () => {
    const newTodos = {
      ...todos,
    };
    for (let key in newTodos) {
      newTodos[key] = newTodos[key].map((todo) => ({...todo}));
    }
    return newTodos;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // const [items, setItems] = useState(['1', '2', '3']);

  const updateChecked = (category, todoIndex, e) => {
    console.log('update checked starts')
    const newTodos = safeCopyTodos();
    newTodos[category][todoIndex].checked = e.target.checked;
    console.log('newTodos:', newTodos)
    updateTodos(newTodos);
  };
  
  const deleteCategory = (category) => {
    const newTodos = safeCopyTodos();
    delete newTodos[category];
    updateTodoCategories(Object.keys(newTodos).sort());
    updateTodos(newTodos);
  };

  const deleteTodo = (category, todoIndex) => {
    const newTodos = safeCopyTodos();
    newTodos[category].splice(todoIndex, 1);
    updateTodos(newTodos);
  };

  const shared = {
    addTodo,
    deleteCategory,
    deleteTodo,
    handleDragEnd,
    hiddenCategories,
    hideCategory,
    onTodoKeyUp,
    safeCopyTodos,
    todos,
    todoTextRefs,
    updateChecked,
  };

  return (
    <Container>
    <div className="form-section" id="health-container">

      {/* add a new category */}
      <div className="todo-row mt-3 mb-5">
        <Form.Group className="mb-3" controlId="categoryInput">
          <Form.Control ref={categoryTextInput} onKeyPress={onCategoryKeyUp} className="inline thin-input mr-5" type="text" placeholder="enter new category" />{'  '}
          <FontAwesomeIcon className="inline" icon={faPlus} onClick={addCategory}/>
        </Form.Group>
      </div>

      <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => handleDragEndCategory(e)}
      >
        <SortableContext
          items={todoCategories}
          strategy={verticalListSortingStrategy}
        >
      {todoCategories.map(category => <SortableCategory category={category} key={category} id={category} value={todos[category]} shared={shared} />)}
      </SortableContext>
            </DndContext>
    </div>
    </Container>
  );
  
  function handleDragEnd(event, category) {
    const {active, over} = event;
    if (active.id !== over.id) {
      const items = todos[category].map((todo) => todo.order);
      updateTodos(() => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newTodos = safeCopyTodos();
        newTodos[category] = arrayMove(newTodos[category], oldIndex, newIndex);
        return newTodos;
      });
    }
  }
  function handleDragEndCategory (event, category) {
    const {active, over} = event;
    if (active.id !== over.id) {
      const items = todoCategories;
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        updateTodoCategories(arrayMove(todoCategories, oldIndex, newIndex))
    }
  }
}

