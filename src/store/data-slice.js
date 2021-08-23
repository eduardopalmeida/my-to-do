import { createSlice } from "@reduxjs/toolkit";
import { fieldSorter } from  '../utils/extras';

const initialState = {
    tasks : [],
    changed : false,
    size : 0
}

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers : {
        replaceTasks(state, action) {
            state.tasks = action.payload.tasks.reverse();
            state.size = action.payload.size;

            state.changed = false;
        },
        addTask(state, action) {
            state.tasks.unshift(action.payload);
            state.size += 1;

            state.changed = true;
        },
        deleteTask(state, action) {
            let newTasksState = state.tasks.filter( task => task.id !== action.payload.id );
            const position = action.payload.position;

            state.size -= 1;
            
            for(const task in newTasksState) {
                if(task.position >= position) {
                    task.position =- 1;
                }
            }
            
            state.tasks = newTasksState;
            state.changed = true;
        },
        swapTaskDone(state, action) {
            const existingTask = state.tasks.find(task => task.id === action.payload);
            existingTask.done = !existingTask.done;

            state.changed = true;
        },
        scoreTaskeUPnDOWN(state, action) {
            const existingTask = state.tasks.find(task => task.id === action.payload.taskID);
            existingTask.score = action.payload.score;

            state.changed = true;
        },
        taskMoveDOWN(state, action) {
            let existingTask = state.tasks.find(task => task.id === action.payload.currTaskID);
            existingTask.position = existingTask.position - 1;

            let existingTaskPrev = state.tasks.find(task => task.id === action.payload.prevTaskID);
            existingTaskPrev.position = existingTaskPrev.position + 1;

            state.tasks = state.tasks.sort(fieldSorter(['position'])).reverse();
            
            state.changed = true;
        },
        taskMoveUP(state, action) {
            let existingTask = state.tasks.find(task => task.id === action.payload.currTaskID);
            existingTask.position = existingTask.position + 1;

            let existingTaskNext = state.tasks.find(task => task.id === action.payload.nextTaskID);
            existingTaskNext.position = existingTaskNext.position - 1;

            state.tasks = state.tasks.sort(fieldSorter(['position'])).reverse();

            state.changed = true;
        }
    }
})

export const dataSliceActions = dataSlice.actions;
export default dataSlice;