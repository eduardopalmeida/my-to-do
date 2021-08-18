import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks : [],
    changed : false,
    value : 0
}
const fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => p ? p : n, 0);

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers : {
        replaceTasks(state, action) {
            state.tasks = action.payload.tasks;
            state.changed = false;
        },
        addTask(state, action) {
            state.tasks.push(action.payload)
            state.changed = true;
        },
        deleteTask(state, action) {
            const newState = state.tasks.filter( task => task.id !== action.payload );
            state.tasks = newState;
            
            state.changed = true;
        },
        swapTaskDone(state, action) {
            const existingTask = state.tasks.find(task => task.id === action.payload);
            existingTask.done = !existingTask.done;

            state.changed = true;
        },
        scoreTaskeUp(state, action) {
            const existingTask = state.tasks.find(task => task.id === action.payload.taskID);
            existingTask.score = action.payload.score;

            state.changed = true;
        },
        taskMoveUP(state, action) {
            let existingTask = state.tasks.find(task => task.id === action.payload.currTaskID);
            existingTask.position = existingTask.position - 1;

            let existingTaskPrev = state.tasks.find(task => task.id === action.payload.prevTaskID);
            existingTaskPrev.position = existingTaskPrev.position + 1;

            state.tasks = state.tasks.sort(fieldSorter(['position']))
            
            state.changed = true;
        },
        taskMoveDOWN(state, action) {
            let existingTask = state.tasks.find(task => task.id === action.payload.currTaskID);
            existingTask.position = existingTask.position + 1;

            let existingTaskNext = state.tasks.find(task => task.id === action.payload.nextTaskID);
            existingTaskNext.position = existingTaskNext.position - 1;

            state.tasks = state.tasks.sort(fieldSorter(['position']))

            state.changed = true;
        }
    }
})

export const dataSliceActions = dataSlice.actions;
export default dataSlice;