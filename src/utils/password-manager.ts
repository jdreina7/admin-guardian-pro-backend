import * as bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Function for hash the user password
 * @param passwword The user password
 */
export const encryptPassword = async (password: string) => {
  return password ? bcrypt.hashSync(password, saltRounds) : null;
};
