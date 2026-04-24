import { UpdateBlueprintAutomatonChassis, UpdateBlueprintLimb, UpdateBlueprintType } from "../../update functions/engineering/update-blueprints";

on("change:repeating_blueprint:blueprint_automatonChassis", UpdateBlueprintAutomatonChassis);
on("change:repeating_blueprint:blueprint_type", UpdateBlueprintType);
on("change:repeating_blueprint:blueprint_limb", UpdateBlueprintLimb);