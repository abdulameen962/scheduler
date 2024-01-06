import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {schedulePushNotification} from "../nativeHelpers";
import { store } from '../redux/store';
import { getNotifications } from '../redux/actions';

export const BACKGROUND_NOTIFICATION_TASK = 'background-notification';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
    const now = Date.now();
    
    try{
        const results = await getNotifications(store);
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            const {body,header} = element;
            await schedulePushNotification(header,body)
        }
    }
    catch(e){
        console.log(e);
    }
  
    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});
  
// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {
    // console.log("registering background fetch");
    const result = await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 30, // 15 minutes it is in secs
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
    // console.log(result);
    return result;
}
  
// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundFetchAsync() {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    // console.log(`Task ${BACKGROUND_NOTIFICATION_TASK} is registered: ${isRegistered}`);
    if (isRegistered) return await BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    return;
}