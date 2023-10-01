/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

import { META_ROLE } from 'src/utils/contants';
import { EValidRoles } from 'src/utils/interfaces';

export const GetRole = (...args: EValidRoles[]) => {
    return SetMetadata(META_ROLE, args);
};
