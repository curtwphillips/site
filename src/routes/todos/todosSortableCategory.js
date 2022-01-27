import { useState } from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { SortableTodo } from './todosSortableTodo';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function SortableCategory(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const {
    category,
    index,
    shared: {
      addTodo,
      deleteCategory,
      handleDragEndTodo,
      hideCategory,
      onTodoKeyUp,
      data,
      updateAllChecked,
    }
  } = props;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '200px',
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [showCategoryAlert, setShowCategoryAlert] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  return (
    <div className="category-container">
      <h3 ref={setNodeRef} className="inline" style={style} {...attributes} {...listeners} key={category}>{category}</h3>
      <FontAwesomeIcon className={`inline ml-10`} icon={faTrash} onClick={() => setShowCategoryAlert(!showCategoryAlert)}/>

      <Alert show={showCategoryAlert} variant="warning">
        <Alert.Heading>Are you sure?</Alert.Heading>
        <p>
          {`This will delete '${category}' and any todos it included.`}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => deleteCategory(category)} variant="outline-danger">
            {`Yes, delete '${category}'`}
          </Button>

          <Button className="ml-10" onClick={() => setShowCategoryAlert(false)} variant="outline-primary">
            Cancel
          </Button>
        </div>
      </Alert>

      { /* Minus sign for collapsed category */ }
      <FontAwesomeIcon key={category + '-hide-icon'} size={'1x'} className="inline lower-icon" icon={data[index].hidden ? faMinus : faAngleDown} onClick={() => hideCategory(category)}/>
      <div key={category + '-outer-div'}>

      {/* container for hiding todos in category */}
      <div key={category + '-category-hide-div'} className={data[index].hidden ? 'hidden' : ''}>

        {/* check/uncheck all */}
        <div className="todo-row inline">
            <Form.Group className="mb-3 inline" controlId="todoList" >
              <Form.Check onChange={(e) => updateAllChecked(e, category, setAllChecked)} className="inline ml-10" type="checkbox" checked={allChecked}/>
              <label style={style} {...attributes} {...listeners} className="ml-10 inline"></label>
            </Form.Group>
        </div>

        <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEndTodo(e, category)}
        key={`dnd-context-${category}`}
        >
          <SortableContext key={`sortable-context-${category}`}
            items={data[index].todos.map((todo) => todo.order.toString())}
            strategy={verticalListSortingStrategy}
          >
            {data[index].todos.map((todo, todoIndex) => <SortableTodo handle categoryIndex={index} todoIndex={todoIndex} category={category} key={todo.order} id={todo.order.toString()} value={todo} shared={props.shared} />)}

          </SortableContext>
        </DndContext>

        {/* add a new todo under this category */}
        <div key={category + '-add'} className="todo-row mt-3 mb-5">
          <Form.Group className="mb-3" controlId="todoInput">
            <Form.Control ref={data[index].todoTextRef} onKeyPress={(e) => onTodoKeyUp(e, category)} className="inline thin-input mr-5" type="text" placeholder="todo" />{'  '}
            <FontAwesomeIcon className="inline" icon={faPlus} onClick={() => addTodo(category, null, data[index].todoTextRef)} />
          </Form.Group>
        </div>

      </div>
    </div>
    </div>
  );
}