// DB Connection
export const MONGO_URI = process.env.MONGO_URI;

// Defined ENUMs
export const VALID_ROLES = ['superadmin', 'admin', 'user'];
export const VALID_CREDENTIALS = ['cc', 'ce', 'nip', 'nit', 'ti', 'pap', 'rc'];
export const VALID_OCUPATIONS = ['employee', 'independent', 'retired', 'student', 'none'];
export const VALID_MARITAL_STATUSES = ['single', 'married', 'free union', 'separate', 'divorced', 'widower'];
export const VALID_GENDERS = ['male', 'female', 'undefined'];

// Errors codes
export const DUPLICATED_RECORD = 11000;

// Errors Messages
export const ERR_MSG_GENERAL = 'An internal server error has occurred, please check the logs.';
export const ERR_MSG_DUPLICATED_VALUE = 'The entered value already exists in the database.';
export const ERR_MSG_INVALID_VALUE = 'The entered value is invalid.';
export const ERR_MSG_DATA_NOT_FOUND = 'No results were found with the search value entered.';
export const ERR_MSG_INVALID_PAYLOAD = 'The data entered is invalid or empty.';
export const ERR_MSG_INVALID_ROLE_ID = 'The role ID is invalid or not exist';
export const ERR_MSG_INVALID_MARITAL_STATUS_ID = 'The marital status ID is invalid or not exist';
export const ERR_MSG_INVALID_OCUPATION_ID = 'The ocupation ID is invalid or not exist';
export const ERR_MSG_INVALID_ID = 'The ID is invalid, please enter a correct ID number';
export const ERR_MSG_INVALID_UID = 'The user UID is invalid, please enter a correct user UID number';
