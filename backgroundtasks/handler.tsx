import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {
    BACKGROUND_NOTIFICATION_TASK,
    registerBackgroundFetchAsync
} from "./notifications"


interface Task {
    name: string;
    register: () => Promise<void>;
}

/**
 * Handler for registering all  background tasks.
 * @returns {Promise<void>}
 */
const registerAllTasks = async () => {
    // get all names of tasks in an array of objects made up of names and the function to invoke the creation
    const status = await BackgroundFetch.getStatusAsync();

    const allTasks = [
        {
            name: BACKGROUND_NOTIFICATION_TASK,
            register: registerBackgroundFetchAsync
        }
    ]

    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        await confirmTask(task);
    }
    
}

const confirmTask = async (name: Task) => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(name.name);
    // console.log(`Task ${name.name} is registered: ${isRegistered}`);
    if (!isRegistered) await name.register();
    
    return;
}

export default registerAllTasks;