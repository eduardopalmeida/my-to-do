import { useDispatch } from 'react-redux';
import { swapTaskDone, scoreUPnDOWN, deleteTask, positionUP, positionDOWN } from '../../store/data-actions';
import classes from './Task.module.css';

const Task = (props) => {
    const dispatch = useDispatch();
    
    const scoreCalc = (score,goal) => {
        let res = '';
        for(let i = goal - score; i > 0; i--) { res += '⬜️';     }
        return res;
    }
    
    const goalCalc = (score) => {
        let res = '';
        for(let i = score; i > 0; i--)        { res += '⬛️';     }
        return res;
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
        dispatch(deleteTask(props.id));
    }

    const handleTaskPositionUP = () => {
        dispatch( positionUP(props.id, props.prev, props.position, props.size ) );
    }

    const handleTaskPositionDOWN = () => {
        dispatch( positionDOWN(props.id, props.next, props.position, props.size ) );
    }

    // ⬇⬆

    // console.log("PROPS :: ", props);

    return (
        <li className={classes.retangulo} >
            <div className={classes.buttons}>
                <button 
                    onClick={handleTaskDelete}
                >❌</button>
                <button 
                    onClick={handleTaskPositionUP}
                >⬆</button>
                <button 
                    onClick={handleTaskPositionDOWN}
                >⬇</button>
            </div>
            <div className={classes.text}>{props.text}</div>
            <div className={classes.work}>
                {/* {quantityCalc(props.score, props.goal)} */}
                <span 
                    className={classes.score} 
                    onClick={scoreDOWNHandler} 
                >
                    { goalCalc(props.score) }
                </span>
                <span 
                    className={classes.score} 
                    onClick={scoreUPHandler} 
                >
                    { scoreCalc(props.score, props.goal)  }
                </span>
            </div>
            <div 
                className={classes.done} 
                onClick={doneHandler} 
            >{props.done ? "✅" : "☑️"}</div>
        </li>
    )
}

export default Task;