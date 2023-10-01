import * as bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Function for hash the user password
 * @param passwword The user password
 */
export const encryptPassword = async (password: string) => {
  return password ? bcrypt.hashSync(password, saltRounds) : null;
};

/**
 * Function for validate the password of the login function
 * @param loginPassword The password that coming in the login request
 * @param dbUserPassword The DB user password
 * @returns Return true or false
 */
export const comparePasswords = async (loginPassword: string, dbUserPassword: string) => {
  return bcrypt.compareSync(loginPassword, dbUserPassword);
};
