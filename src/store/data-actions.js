import axios from "axios";
import { dataSliceActions } from "./data-slice";

const FIREBASE_URL = 'https://react-http-1eb72-default-rtdb.firebaseio.com/';

// sorts arrays with the indicated array of fields
const fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => p ? p : n, 0);


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

            dispatch(dataSliceActions.replaceTasks({
                tasks : transformedData.sort(fieldSorter(['position'])) || {}
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

export const deleteTask = (id) => {
    return async (dispatch) => {
        try {
            await axios.delete(FIREBASE_URL + 'tasks/' + id + '.json')
            .then( (response) => {
                console.log("Axios - TASK DELETE - Success :: ", response );
            })
            .catch((error) => {
                console.log("Axios - TASK DELETE - Error :: ", error );
            });

            dispatch(dataSliceActions.deleteTask(id));
        }
        catch (error) {
            console.log("ERROR : DELETING TASK");
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
            console.log("ERROR : TRANSFORMING TASK DATA - SCORE");
        }
    }
}

export const positionUP = (taskID, prevTaskID, position, size) => {
    return async(dispatch) => {
        try {
            if( ( position - 1 )  >= 0 ) { 
                await axios.patch(FIREBASE_URL + 'tasks/' + taskID + '.json', { position : position - 1 })
                    .then( (response) => {
                        console.log("Axios - POSTITION_UP - Success :: ", response );
                    })
                    .catch((error) => {
                        console.log("Axios - POSTITION_UP - Error :: ", error );
                    });

                    await axios.patch(FIREBASE_URL + 'tasks/' + prevTaskID + '.json', { position : position })
                    .then( (response) => {
                        console.log("Axios - POSTITION_UP_PREV - Success :: ", response );
                    })
                    .catch((error) => {
                        console.log("Axios - POSTITION_UP_PREV - Error :: ", error );
                    });

                    dispatch(dataSliceActions.taskMoveUP({
                        currTaskID : taskID,
                        prevTaskID : prevTaskID
                    }));
            }
        } catch (error) {
            console.log("ERROR : TRANSFORMING TASK DATA -- POSITION_UP");
        }
    }
}

export const positionDOWN = (taskID, nextTaskID, position, size) => {
    return async(dispatch) => {
        try {
            if( ( position + 1 )  <= size ) { 
                await axios.patch(FIREBASE_URL + 'tasks/' + taskID + '.json', { position : position + 1})
                .then( (response) => {
                    console.log("Axios - POSTITION_DOWN - Success :: ", response );
                })
                .catch((error) => {
                    console.log("Axios - POSTITION_DOWN - Error :: ", error );
                });

                await axios.patch(FIREBASE_URL + 'tasks/' + nextTaskID + '.json', { position : position })
                .then( (response) => {
                    console.log("Axios - POSTITION_DOWN_PREV - Success :: ", response );
                })
                .catch((error) => {
                    console.log("Axios - POSTITION_DOWN_PREV - Error :: ", error );
                });

                dispatch(dataSliceActions.taskMoveDOWN({
                    currTaskID : taskID,
                    nextTaskID : nextTaskID
                }));
                
            }
        } catch (error) {
            console.log("ERROR : TRANSFORMING TASK DATA -- POSITION_UP");
        }
    }
}
