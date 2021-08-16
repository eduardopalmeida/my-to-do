import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks : [],
    changed : false,
    value : 0
}

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers : {
        replaceTasks(state, action) {
            state.tasks = action.payload.tasks;
            state.changed = false;
        },
        swapTaskDone(state, action) {
            const existingTask = state.tasks.find(task => task.id === action.payload);
            existingTask.done = !existingTask.done;

            state.changed = true;
        },
        scoreTaskeUp(state, action) {
            const existingTask = state.tasks.find(task => task.id === action.payload.taskID);
            existingTask.score = action.payload.score

            state.changed = true;
        },
        addTask(state, action) {
            // console.log("TASK #2 ::", action.payload);

            state.tasks.push(action.payload)
            state.changed = true;
        }
    }
})

export const dataSliceActions = dataSlice.actions;
export default dataSlice;