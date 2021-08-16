import classes from './App.module.css';
import { useEffect, useRef } from 'react';
import Task from './Components/Task/Task';
import LoadingSpinner from './UI/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask } from './store/data-actions';

function App() {

  // const [tasks, setTasks] = useState([]);
  // const [isLoading, setisLoading] = useState(true)

  // if(isLoading) {
  //   getTasks();
  //   setisLoading(false)
  // }

  const dispatch = useDispatch();
  
  // const changed = useSelector(state => state.data.changed)
  const data = useSelector( state => state.data);

  const taskTextInputRef = useRef();
  const taskGoalInputRef = useRef();

  const submitFormHandler = (event) => {
    event.preventDefault();

    const enteredText  = taskTextInputRef.current.value;
    const enteredGoal = taskGoalInputRef.current.value;

    dispatch(addTask(enteredText, +enteredGoal));
  }
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // useEffect(() => {
  //   if(changed) {
  //     dispatch(sendTaskData(data.tasks));
  //   }  
  // }, [dispatch, changed, data.tasks]);
  

  // if(changed === true) {
  //   console.log("!!! CHANGED !!!");
  // }

  return (
      data.tasks ?
      <>
        <div className={classes.titulo}>
          <h1>TO-DO</h1>
        </div>
        <form 
          className={classes.addTaskForm}
          onSubmit={submitFormHandler}
        >
            <label htmlFor='ttext'>Task </label>
            <input 
              className={classes.texto} 
              type="text" 
              id="ttext" 
              name="ttext" 
              ref={taskTextInputRef}
              maxLength="25"
              placeholder="...task you need to do"
              required
            />
            <input 
              type="number" 
              id="tgoal" 
              defaultValue="1" 
              min ="1" 
              max="10" 
              ref={taskGoalInputRef}
              required
            />
            <button>Add Task</button>
        </form>
        {
          data.tasks.length > 0 ?

          <ul className={classes.taskContainer}>
            {
              data.tasks.map( (task, index) => (
                <Task 
                  key   = { index      }
                  id    = { task.id    }
                  done  = { task.done  }
                  score = { task.score }
                  goal  = { task.goal  }
                  text  = { task.text  }
                />
              ))
            }
          </ul>
          : <p className={classes.emptyContainer}>Please add a task...</p>
        }

      </>
    : <LoadingSpinner />
  );
}

export default App;