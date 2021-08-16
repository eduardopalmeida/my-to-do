import axios from "axios";
import { dataSliceActions } from "./data-slice";

const FIREBASE_URL = 'https://react-http-1eb72-default-rtdb.firebaseio.com/';

export const sendTaskData = (taskData) => {
    return async (dispatch) => {
        try {
            await axios.put(FIREBASE_URL + 'tasks.json', taskData)
            .then( (response) => {
                console.log("Axios - SENDTASKDATA - Success :: ", response );
            })
            .catch((error) => {
                console.log("Axios - SENDTASKDATA - Error :: ", error );
            });
        } catch( error ) {
            console.log("ERROR : SENDING TASK DATA");
        }
    };
}

export const fetchTasks = () => {
    return async (dispatch) => {
        try {
            const transformedData = [];
            let data = 
                await axios.get(FIREBASE_URL + 'tasks.json')
                    .then( (response) => {
                        return response.data;
                    })
                    .catch((error) => {
                        console.log("ERROR : AXIOS GET TASKS");
                        console.log(error);
                    });

            for (const key in data) {
              transformedData.push({
                  id: key,
                  ...data[key],
              });
            }

            console.log("PIM!");

            dispatch(dataSliceActions.replaceTasks({
                tasks : transformedData || {}
            }))

        } catch (error) {
            console.log("ERROR : TRANSFORMING TASK DATA");
        }
    }
}

export const addTask = (text, goal) => {

    const task = {
        done : false,
        goal : goal,
        score : 0,
        text : text,
    };

    console.log("TASK #1 ::: ", task);

    return async (dispatch) => {
        try {
            let tmp_ID;

            await axios.post(FIREBASE_URL + 'tasks.json', task)
            .then( (response) => {
                console.log("Axios - TASK ADD - Success :: ", response );
                tmp_ID = response.data.name;
            })
            .catch((error) => {
                console.log("Axios - TASK ADD - Error :: ", error );
            });

            dispatch(dataSliceActions.addTask({
                ...task,
                id : tmp_ID
            }));
        }
        catch (error) {
            console.log("ERROR : ADDING TASK");
        }
    }
}

export const swapTaskDone = (taskID, value) => {
    return async (dispatch) => {
        try {
            const invValue = !value;

            await axios.patch(FIREBASE_URL + 'tasks/' + taskID + '.json', {done: invValue})
            .then( (response) => {
                console.log("Axios - DONE - Success :: ", response );
            })
            .catch((error) => {
                console.log("Axios - DONE - Error :: ", error );
            });
            
            dispatch(dataSliceActions.swapTaskDone(taskID));
        } catch (error) {
            console.log("ERROR : TRANSFORMING TASK DATA");
        }
    }
}

export const scoreUPnDOWN = (taskID, score) => {
    return async (dispatch) => {
        try {

            console.log("TASK_ID :: ", taskID);
            console.log("SCORE :: ", score);

            await axios.patch(FIREBASE_URL + 'tasks/' + taskID + '.json', {score: score})
            .then( (response) => {
                console.log("Axios - SCORE - Success :: ", response );
            })
            .catch((error) => {
                console.log("Axios - SCORE - Error :: ", error );
            });
            
            dispatch(dataSliceActions.scoreTaskeUp({
                taskID, score
            }));
        } catch (error) {
            console.log("ERROR : TRANSFORMING TASK DATA");
        }
    }
}
