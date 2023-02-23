import { FILTER } from "../Constants";

export const filterData = (data) => {
    console.log("action", data);
    return {
        type: FILTER,
        data: data
    }
}

