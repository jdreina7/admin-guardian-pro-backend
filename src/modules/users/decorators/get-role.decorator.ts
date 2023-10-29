/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

import { META_ROLE } from './../../../utils/contants';
import { EValidRoles } from './../../../utils/interfaces';

export const GetRole = (...args: EValidRoles[]) => {
    return SetMetadata(META_ROLE, args);
};
