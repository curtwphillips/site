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
    shared: {
      addTodo,
      deleteCategory,
      handleDragEnd,
      hiddenCategories,
      hideCategory,
      onTodoKeyUp,
      todos,
      todoTextRefs,
    }
  } = props;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [showCategoryAlert, setShowCategoryAlert] = useState(false);

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
      <FontAwesomeIcon key={category + '-hide-icon'} size={hiddenCategories[category] ? '1x' : '1x'} className="inline lower-icon" icon={hiddenCategories[category] ? faMinus : faAngleDown} onClick={() => hideCategory(category)}/>
      <div key={category + '-outer-div'}>

      {/* container for hiding todos in category */}
      <div key={category + '-category-hide-div'} className={hiddenCategories[category] ? 'hidden' : ''}>
        <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e, category)}
        key={`dnd-context-${category}`}
        >
          <SortableContext key={`sortable-context-${category}`}
            items={todos[category].map((todo) => todo.order)}
            strategy={verticalListSortingStrategy}
          >
            {todos[category].map((todo, todoIndex) => <SortableTodo handle index={todoIndex} category={category} key={todo.order} id={todo.order} value={todo} shared={props.shared} />)}

          </SortableContext>
        </DndContext>

        {/* add a new todo under this category */}
        <div key={category + '-add'} className="todo-row mt-3 mb-5">
          <Form.Group className="mb-3" controlId="todoInput">
            <Form.Control ref={todoTextRefs[category]} onKeyPress={(e) => onTodoKeyUp(e, category)} className="inline thin-input mr-5" type="text" placeholder="todo" />{'  '}
            <FontAwesomeIcon className="inline" icon={faPlus} onClick={() => addTodo(category, null, todoTextRefs[category])} />
          </Form.Group>
        </div>

      </div>
    </div>
    </div>
  );
}