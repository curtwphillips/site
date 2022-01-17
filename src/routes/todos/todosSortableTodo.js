import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export function SortableTodo(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const {
    category,
    index: todoIndex,
    shared: {
      deleteTodo,
      updateChecked,
      todos,
    }
  } = props;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const todo = props.value;

  return (
    <div ref={setNodeRef}>

      
      
        <div className="todo-row inline" key={todo.name}>
          
        
          <Form.Group className="mb-3 inline" controlId="todoList" >
            <Form.Check onChange={(e) => updateChecked(category, todoIndex, e)} className="inline ml-10" type="checkbox" id={todo.name}/>
            {/* <div style={style} {...attributes} {...listeners}></div> */}
            <label style={style} {...attributes} {...listeners} className={`ml-10 inline ${todos[category][todoIndex].checked ? 'strike' : ''}`}>{todo.text}</label>
            {/* </div> */}
            <FontAwesomeIcon className={`inline ml-10 ${todos[category][todoIndex].checked ? '' : 'hidden'}`} icon={faTrash} onClick={() => deleteTodo(category, todoIndex)}/>
          </Form.Group>
      </div>
    </div>
  );
}
