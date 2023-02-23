import { FILTER } from "../Constants"

// For Multiple item starts //

export default function filterItem(state = [], action) {
    switch (action.type) {
        case FILTER:
            console.log("reducer", action)
            return [
                ...state,
                { filterData: action.data }
            ]
        default:
            return state
    }


}

//=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//