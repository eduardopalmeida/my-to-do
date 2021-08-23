import { useDispatch } from 'react-redux';
import { swapTaskDone, scoreUPnDOWN, deleteTask, positionDOWN, positionUP } from '../../store/data-actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
        faCheckCircle as fasCheckCircle, 
        faCircle as fasCircle, 
        faSortUp, 
        faSortDown, 
        faTimes,
       } from '@fortawesome/free-solid-svg-icons';
import { 
        faCheckCircle as farCheckCircle, 
        faCircle as farCircle,
        faPlusSquare,
        faMinusSquare
       } from '@fortawesome/free-regular-svg-icons';

import classes from './Task.module.css';

const Task = (props) => {
    const dispatch = useDispatch();

    const scoreCalc = (score,goal) => {
        let jsxBuffer = [];
        for(let i = goal - score; i > 0; i--) { jsxBuffer.push(<FontAwesomeIcon key={i} icon={farCircle} />); }

        return jsxBuffer;
    }
    
    const goalCalc = (score) => {
        let jsxBuffer = [];
        for(let i = score; i > 0; i--) { jsxBuffer.push(<FontAwesomeIcon key={i} icon={fasCircle} />); }

        return jsxBuffer;
    }
    
    const doneHandler = () => {
        dispatch(swapTaskDone(props.id, props.done));

        if(props.score === props.goal) {
            dispatch(scoreUPnDOWN(props.id, 0));
        }
        if(props.score !== props.goal) {
            dispatch(scoreUPnDOWN(props.id, props.goal));
        }
    }
    
    const scoreUPHandler = () => {
        if(props.score < props.goal) {
            dispatch(scoreUPnDOWN(props.id, props.score + 1));
        }
        if(props.score + 1 === props.goal) {
            dispatch(swapTaskDone(props.id, props.done));
        }
    }
    
    const scoreDOWNHandler = () => {
        if(props.score > 0) {
            dispatch(scoreUPnDOWN(props.id, props.score - 1));
        }
        if(props.score === props.goal) {
            dispatch(swapTaskDone(props.id, props.done));
        }
    }

    const handleTaskDelete = () => {
        dispatch(deleteTask(props.id, props.position ));
    }

    const handleTaskPositionUP = () => {
        dispatch( positionUP(props.id, props.next, props.position, props.size ) );
    }

    const handleTaskPositionDOWN = () => {
        dispatch( positionDOWN(props.id, props.prev, props.position, props.size ) );
    }

    return (
        <li className={classes.retangulo} >
            <div className={classes.posControls}>
                <button onClick={handleTaskDelete} >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <button onClick={handleTaskPositionUP} >
                    <FontAwesomeIcon icon={faSortUp} />
                </button>
                <button onClick={handleTaskPositionDOWN} >
                    <FontAwesomeIcon icon={faSortDown} />
                </button>
            </div>
            <div className={classes.text}>
                {props.text}
            </div>
            <div className={classes.work} >
                <button className={classes.scoreControls} >
                    <FontAwesomeIcon  
                        icon={faMinusSquare} 
                        onClick={scoreDOWNHandler}
                    />
                </button>
                <span 
                    className={classes.score} 
                >
                    { goalCalc(props.score) }
                </span>
                <span 
                    className={classes.score} 
                >
                    { scoreCalc(props.score, props.goal)  }
                </span>
                <button className={classes.scoreControls} >
                    <FontAwesomeIcon 
                        icon={faPlusSquare} 
                        onClick={scoreUPHandler}
                    />
                </button>
            </div>
            <div 
                className={classes.done} 
                onClick={doneHandler} 
            >
            {
                props.done ? <FontAwesomeIcon icon={fasCheckCircle} color="#24b417" /> 
                           : <FontAwesomeIcon icon={farCheckCircle} color="#c8e4c6" /> 
            }
            </div>
        </li>
    )
}

export default Task;
