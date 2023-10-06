import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

import { DUPLICATED_RECORD, ERR_MSG_DUPLICATED_VALUE, ERR_MSG_GENERAL, ERR_MSG_INVALID_ID } from './contants';
import { isValidObjectId } from 'mongoose';

/**
 * Function for handling the uncontrolled errors
 * @param error The error object
 * @param data The data that causes the error
 */
export const customHandlerCatchException = async (error: any, data?: any) => {
  /* istanbul ignore next */
  if (error) {
    console.log(error);
  }

  // Returns error if data already exist in DB
  if (error?.code === DUPLICATED_RECORD) {
    throw new BadRequestException({
      success: false,
      message: ERR_MSG_DUPLICATED_VALUE,
      invalidValue: data,
    });
  }

  throw new InternalServerErrorException({
    success: false,
    message: ERR_MSG_GENERAL,
    invalidValue: data,
  });
};

//Validate id

export const customValidateMongoId = async (id: string) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestException({
      success: false,
      message: ERR_MSG_INVALID_ID,
      invalidValue: id,
    });
  }

  return true;
};

/**
 * Function for capitalize a word
 * @param word The word for be capitalized
 * @returns Return the word capitalized
 */
export const customCapitalizeFirstLetter = async (word: string) => {
  const wordCapitalized = word[0].toUpperCase() + word.slice(1);

  return wordCapitalized;
};

/**
 * Function for evaluate if an user ID is valid or not
 * @param uid The user unique ID
 * @returns True or false
 */
export const validateUID = async (uid: number) => {
  if (uid === 0 || uid?.toString().length < 5) {
    return false;
  }

  return true;
};
