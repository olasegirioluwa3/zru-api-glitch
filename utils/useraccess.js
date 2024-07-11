// Access control function
const userHaveAccess = (userId1, userId2, role) => {
    switch (role) {
        case "admin":
        case "regcenter":
            return true;
        case "user":
            return String(userId1) === String(userId2);
        default:
            return String(userId1) === String(userId2);
    }
};

const useraccess = {
    userHaveAccess
};

export default useraccess;