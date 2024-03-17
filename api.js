import { EXPO_PUBLIC_API_KEY, EXPO_PUBLIC_BASE_URL } from "@env"

const BASE_URL = EXPO_PUBLIC_BASE_URL
const API_KEY = EXPO_PUBLIC_API_KEY
    // console.log(API_KEY)
const BASE_FUNCTION = async(url, method, fetchBody = null, extraHeaders = {}, handleChange = false) => {
    try {
        let response;
        if (method.toLowerCase() === "get") {
            response = await fetch(`${BASE_URL}${url}`, {
                method: `${method}`,
                headers: {
                    'content-type': 'application/json',
                    "X-Api-Key": API_KEY,
                    ...extraHeaders,
                },
            })
        } else {
            response = await fetch(`${BASE_URL}${url}`, {
                method: `${method}`,
                headers: {
                    'content-type': 'application/json',
                    "X-Api-Key": API_KEY,
                    ...extraHeaders,
                },
                body: JSON.stringify(fetchBody)

            })
        }
        const result = await response.json();
        if (response.ok) {
            if (handleChange) {
                return result;
            }
            return true;
        }

        const { message, detail } = result;
        throw new Error(message ? message : detail);
    } catch (err) {
        console.log(err.message);
        throw new Error(err.message);
    }
}

export const login = async(username, password, fcm_token, device_type) => {
    const url = "users/login/";
    const method = "POST";
    const body = {
        username,
        password,
        fcm_token,
        device_type
    }
    const header = {}
    const result = await BASE_FUNCTION(url, method, body, header, true);
    return result;
}

export const googleEntry = async(token, fcm_token, device_type) => {
    const url = "users/google/";
    const method = "POST";
    const body = {
        token,
        fcm_token,
        device_type
    }
    const header = {}
    const result = await BASE_FUNCTION(url, method, body, header, true);
    const { data } = result;
    return data;
}

export const getProfile = async authCode => {
    const url = "profile/";
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    return await BASE_FUNCTION(url, method, null, header, true);
}

export const createGoal = async(authCode, goal_name, goal_description, start_time, deadline, image) => {
    const url = "create-goals/";
    // new FormData()
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    const body = {
        goal_name,
        goal_description,
        start_time,
        deadline,
        image
    }
    return await BASE_FUNCTION(url, method, body, header);

}

export const createTask = async(authCode, goal_id, task_name, task_description, start_time, deadline, labels) => {
    const url = "create-task/";
    // new FormData()
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    const body = {
        goal_id,
        task_name,
        task_description,
        start_time,
        deadline,
        labels: [labels]
    }
    const result = await BASE_FUNCTION(url, method, body, header)
    return result;

}

export const logoutApi = async authCode => {
    const url = "users/logout/";
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    return await BASE_FUNCTION(url, method, null, header);
}

export const getGoals = async(authCode, is_completed = null, num = null) => {
    const url = "goals/";
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }

    const body = {
        num,
        is_completed
    }

    const result = await BASE_FUNCTION(url, method, body, header, true);
    return result;
}

export const predictWord = async(authCode, sentence, word = 1) => {
    const url = "predict-word/";
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }

    const body = {
        sentence,
        word
    }

    const result = await BASE_FUNCTION(url, method, body, header, true);
    const newWord = result.word;
    return newWord;
}

export const getCurrentNotifications = async authCode => {
    const url = "notification/";
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }

    const body = {
        command: "newest"
    }

    const result = await BASE_FUNCTION(url, method, body, header, true);
    return result;
}

export const getOngoingTasks = async(authCode, command = "ongoing", num = 5) => {
    const url = "tasks-info//";
    const method = "POST";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }

    const body = {
        command,
        num
    }

    const result = await BASE_FUNCTION(url, method, body, header, true);
    return result;
}

export const register = async(username, email, password1, password2, fcm_token, device_type) => {
    try {
        const response = await fetch(`${BASE_URL}users/registration/`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password1,
                password2,
                fcm_token,
                device_type,
            }),
            headers: {
                'content-type': 'application/json',
                "X-Api-Key": API_KEY,
            }
        })
        const result = await response.json();
        if (response.ok) {
            const { access, refresh } = result;
            accessTokenName = access;
            refreshTokenName = refresh;
            return result;

        }

        let message = '';
        const valueErrors = Object.values(result);
        for (let i = 0; i < valueErrors.length; i++) {
            const element = valueErrors[i];
            for (let i = 0; i < element.length; i++) {
                const error = element[i];
                message = `${message} ${error}`;
            }

        }
        if (message.length < 10) {
            message = "Something went wrong,check your inputs and try again";
        }
        throw new Error(message);
    } catch (err) {
        throw new Error(err.message);
    }
}

export const resetPassword = async email => {
    const url = "users/password/reset/";
    const method = "POST";
    const body = { email, }
    const header = {}
    return await BASE_FUNCTION(url, method, body, header, true);
}

export const confirmOtp = async(otp, authCode) => {
    const url = "generate-registration-otp/";
    const method = "POST";
    const body = { otp }
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    return await BASE_FUNCTION(url, method, body, header, true);
}

export const resendOtp = async authCode => {
    const url = "generate-registration-otp/";
    const method = "GET";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    return await BASE_FUNCTION(url, method, null, header);
}

export const confirmPasswordOtp = async otp => {
    const url = "users/password/reset/";
    const method = "PUT";
    const body = { otp, }
    return await BASE_FUNCTION(url, method, body);
}

export const changeNewPassword = async(password, email) => {
    const url = "users/password/reset/change/";
    const method = "POST";
    const body = { password, email, }
    return await BASE_FUNCTION(url, method, body);
}

export const getLabels = async authCode => {
    const url = "labels/";
    const method = "GET";
    const header = {
        "Authorization": `Bearer ${authCode}`
    }
    const result = await BASE_FUNCTION(url, method, null, header, true);
    return result;
}