import { SetMetadata } from '@nestjs/common';
import { CHECK_ABILITY } from 'src/shared/constants/casl';
import { Action, Resource } from 'src/shared/enums/casl-action.enum';

export interface RequiredRule {
  action: Action;
  subject: Resource | string;
  field?: string;
}

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export const ReadUsers = () => CheckAbilities({ action: Action.READ, subject: Resource.USER });

export const CreateUsers = () => CheckAbilities({ action: Action.CREATE, subject: Resource.USER });

export const UpdateUsers = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.USER });

export const DeleteUsers = () => CheckAbilities({ action: Action.DELETE, subject: Resource.USER });

export const ManageUsers = () => CheckAbilities({ action: Action.MANAGE, subject: Resource.USER });

export const ReadRoles = () => CheckAbilities({ action: Action.READ, subject: Resource.ROLE });

export const CreateRoles = () => CheckAbilities({ action: Action.CREATE, subject: Resource.ROLE });

export const UpdateRoles = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.ROLE });

export const DeleteRoles = () => CheckAbilities({ action: Action.DELETE, subject: Resource.ROLE });

export const ManageRoles = () => CheckAbilities({ action: Action.MANAGE, subject: Resource.ROLE });

export const ReadPermissions = () =>
  CheckAbilities({ action: Action.READ, subject: Resource.PERMISSION });

export const CreatePermissions = () =>
  CheckAbilities({ action: Action.CREATE, subject: Resource.PERMISSION });

export const UpdatePermissions = () =>
  CheckAbilities({ action: Action.UPDATE, subject: Resource.PERMISSION });

export const DeletePermissions = () =>
  CheckAbilities({ action: Action.DELETE, subject: Resource.PERMISSION });

export const ManagePermissions = () =>
  CheckAbilities({ action: Action.MANAGE, subject: Resource.PERMISSION });

export const ReadProducts = () => CheckAbilities({ action: Action.READ, subject: Resource.PRODUCT });
export const CreateProducts = () => CheckAbilities({ action: Action.CREATE, subject: Resource.PRODUCT });
export const UpdateProducts = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.PRODUCT });
export const DeleteProducts = () => CheckAbilities({ action: Action.DELETE, subject: Resource.PRODUCT });
export const ManageProducts = () => CheckAbilities({ action: Action.MANAGE, subject: Resource.PRODUCT });

export const ReadBrands = () => CheckAbilities({ action: Action.READ, subject: Resource.BRAND });
export const CreateBrands = () => CheckAbilities({ action: Action.CREATE, subject: Resource.BRAND });
export const UpdateBrands = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.BRAND });
export const DeleteBrands = () => CheckAbilities({ action: Action.DELETE, subject: Resource.BRAND });

export const ReadCategories = () => CheckAbilities({ action: Action.READ, subject: Resource.CATEGORY });
export const CreateCategories = () => CheckAbilities({ action: Action.CREATE, subject: Resource.CATEGORY });
export const UpdateCategories = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.CATEGORY });
export const DeleteCategories = () => CheckAbilities({ action: Action.DELETE, subject: Resource.CATEGORY });

export const ReadFeatures = () => CheckAbilities({ action: Action.READ, subject: Resource.FEATURE });
export const CreateFeatures = () => CheckAbilities({ action: Action.CREATE, subject: Resource.FEATURE });
export const UpdateFeatures = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.FEATURE });
export const DeleteFeatures = () => CheckAbilities({ action: Action.DELETE, subject: Resource.FEATURE });

export const ReadSpecifications = () => CheckAbilities({ action: Action.READ, subject: Resource.SPECIFICATION });
export const CreateSpecifications = () => CheckAbilities({ action: Action.CREATE, subject: Resource.SPECIFICATION });
export const UpdateSpecifications = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.SPECIFICATION });
export const DeleteSpecifications = () => CheckAbilities({ action: Action.DELETE, subject: Resource.SPECIFICATION });

export const ReadFactories = () => CheckAbilities({ action: Action.READ, subject: Resource.FACTORY });
export const CreateFactories = () => CheckAbilities({ action: Action.CREATE, subject: Resource.FACTORY });
export const UpdateFactories = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.FACTORY });
export const DeleteFactories = () => CheckAbilities({ action: Action.DELETE, subject: Resource.FACTORY });

export const ReadSuppliers = () => CheckAbilities({ action: Action.READ, subject: Resource.SUPPLIER });
export const CreateSuppliers = () => CheckAbilities({ action: Action.CREATE, subject: Resource.SUPPLIER });
export const UpdateSuppliers = () => CheckAbilities({ action: Action.UPDATE, subject: Resource.SUPPLIER });
export const DeleteSuppliers = () => CheckAbilities({ action: Action.DELETE, subject: Resource.SUPPLIER });
