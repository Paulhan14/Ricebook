import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastProfile = {
	position: "top-center",
	autoClose: 3500,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: false,
	progress: undefined,
};

export const handleRequestErr = (err) => {
    if (err.response.status === 400) {
        showToastWithErr("check your input please!");
    } else if (err.response.status === 401) {
        showToastWithErr("please login first!");
    } else if (err.response.status === 500) {
        showToastWithErr("Oops! Server error!");
    } else {
        showToastWithErr("Oops! Something went wrong!");
    }
}

export const showToastWithMsg = (msg) => {
	toast.success(msg, toastProfile);
};

export const showToastWithErr = (err) => {
	toast.error(err, toastProfile);
};
