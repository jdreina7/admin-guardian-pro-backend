import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DUPLICATED_RECORD, ERR_MSG_DUPLICATED_VALUE, ERR_MSG_GENERAL } from './contants';

/**
 * Function for handling the uncontrolled errors
 * @param error The error object
 * @param data The data that causes the error
 */
export const customHandlerCatchException = async (error: any, data?: any) => {
  // Returns error if  rol already exist in DB
  if (error?.code === DUPLICATED_RECORD) {
    throw new BadRequestException({
      success: false,
      message: ERR_MSG_DUPLICATED_VALUE,
      invalidValue: data?.rol,
    });
  }

  console.log(error);

  throw new InternalServerErrorException({
    success: false,
    message: ERR_MSG_GENERAL,
  });
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
