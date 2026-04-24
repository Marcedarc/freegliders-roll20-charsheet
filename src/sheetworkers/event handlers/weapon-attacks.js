import { UpdateMeleeWeapon, UpdateMeleeWeaponRoll } from "../update functions/combat/update-meleeweapons";
import { UpdateRangedWeapon, UpdateRangedWeaponRoll } from "../update functions/combat/update-rangedweapons";

on("change:repeating_meleeWeapon:meleeWeapon_name", UpdateMeleeWeapon);
on("change:repeating_meleeWeapon:meleeWeapon_damage", UpdateMeleeWeapon);
on("change:repeating_meleeWeapon:meleeWeapon_skill", UpdateMeleeWeapon);
on("change:repeating_meleeWeapon:meleeWeapon_atk", UpdateMeleeWeaponRoll);
on("change:repeating_meleeWeapon:meleeWeapon_weaponExpert", UpdateMeleeWeapon);

on("change:repeating_rangedWeapon:rangedWeapon_name", UpdateRangedWeapon);
on("change:repeating_rangedWeapon:rangedWeapon_damage", UpdateRangedWeapon);
on("change:repeating_rangedWeapon:rangedWeapon_skill", UpdateRangedWeapon);
on("change:repeating_rangedWeapon:rangedWeapon_atk", UpdateRangedWeaponRoll);
on("change:repeating_rangedWeapon:rangedWeapon_weaponExpert", UpdateRangedWeapon);
on("change:repeating_rangedWeapon:rangedWeapon_quality", UpdateRangedWeapon);