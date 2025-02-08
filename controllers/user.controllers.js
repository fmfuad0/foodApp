import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';

const getUserDetails = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new apiResponse(200, { channel: "demo channel" }, "successfully fetched user details")
        );
})


export {
    getUserDetails,
}