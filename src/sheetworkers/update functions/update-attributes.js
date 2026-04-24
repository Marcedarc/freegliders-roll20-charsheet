import { Signed } from "../helpers";
import { UpdateRangedWeapons } from "./combat/update-rangedweapons";
import { UpdateMaxMemorisedBlessings } from "./magic/update-blessings";
import { UpdateArtillery, UpdateBow, UpdateBrawling, UpdateOneHandedMelee, UpdatePistol, UpdateRifle, UpdateShield, UpdateTwoHandedMelee } from "./skills/update-skills-combat";
import { UpdateAugmentation, UpdateAutomachinery, UpdateClockworkMechanics, UpdateGunsmithing, UpdateTinkering, UpdateVehicleMechanics } from "./skills/update-skills-engineering";
import { UpdateAstronomy, UpdateEconomy, UpdateHistory, UpdateLiterature, UpdateMedicine, UpdateMythology, UpdateNature, UpdateSurvival } from "./skills/update-skills-knowledge";
import { UpdateAlchemy, UpdatePrayer, UpdateRunecraft, UpdateSpellwork, UpdateSummoning } from "./skills/update-skills-magic";
import { UpdateArtisanship, UpdateAthletics, UpdatePerception, UpdatePiloting, UpdateStealth } from "./skills/update-skills-physical";
import { UpdateDeception, UpdateIntimidation, UpdatePerformance, UpdatePersuasion } from "./skills/update-skills-social";
import { UpdateEvasion, UpdateInitiative, UpdateUnarmedStrike } from "./update-combat";
import { UpdateSRD } from "./magic/update-spells";
import { UpdateNpcAttackAtks, UpdateNpcAttackSaveDifficulties } from "../npc/npc";

export function UpdateAgi() {
    getAttrs(["agility", "agileBonus", "clumsyPenalty"], function(values) {
        let agility = parseInt(values.agility)||0;
        let agileBonus = parseInt(values.agileBonus)||0;
        let clumsyPenalty = parseInt(values.clumsyPenalty)||0;

        setAttrs({
            "agi": Signed(agility-5+agileBonus+clumsyPenalty)
        });

        UpdatePiloting();
        UpdateStealth();
        UpdateArtisanship();
        UpdateGunsmithing();
        UpdateTinkering();
        UpdateArtillery();
        UpdateBrawling();
        UpdateBow();
        UpdatePistol();
        UpdateRifle();
        UpdateOneHandedMelee();
        UpdateInitiative();
        UpdateEvasion();
        UpdateNpcAttackAtks();
        UpdateNpcAttackSaveDifficulties();
      });
}

export function UpdateBod() {
    getAttrs(["body", "addictPenalty"], function(values) {
        let body = parseInt(values.body)||0;
        let addictPenalty = parseInt(values.addictPenalty)||0;

        setAttrs({
            "bod": Signed(body - 5 + addictPenalty)
        });

        UpdateAthletics();
        UpdateVehicleMechanics();
        UpdateShield();
        UpdateTwoHandedMelee();
        UpdateUnarmedStrike();
        UpdateRangedWeapons(); // for damage and some atk values
        UpdateNpcAttackAtks();
        UpdateNpcAttackSaveDifficulties();
      });
}

export function UpdateCha() {
    getAttrs(["charisma", "silverTongueBonus", "sociallyIneptPenalty"], function(values) {
        let charisma = parseInt(values.charisma)||0;
        let silverTongueBonus = parseInt(values.silverTongueBonus)||0;
        let sociallyIneptPenalty = parseInt(values.sociallyIneptPenalty)||0;

        setAttrs({
            "cha": Signed(charisma - 5 + silverTongueBonus + sociallyIneptPenalty)
        });

        UpdateDeception();
        UpdateIntimidation();
        UpdatePerformance();
        UpdatePersuasion();
        UpdateNpcAttackAtks();
        UpdateNpcAttackSaveDifficulties();
      });
}

export function UpdateInt() {
    getAttrs(["intuition"], function(values) {
        let intuition = parseInt(values.intuition)||0;

        setAttrs({
            "int": Signed(intuition-5)
        });

        UpdatePerception();
        UpdateSurvival();
        UpdateInitiative();
        UpdateEvasion();
        UpdateNpcAttackAtks();
        UpdateNpcAttackSaveDifficulties();
      });
}

export function UpdateLog() {
    getAttrs(["logic", "analyticalMindBonus", "dullPenalty"], function(values) {
        let logic = parseInt(values.logic)||0;
        let analyticalMindBonus = parseInt(values.analyticalMindBonus)||0;
        let dullPenalty = parseInt(values.dullPenalty)||0;

        setAttrs({
            "log": Signed(logic - 5 + analyticalMindBonus + dullPenalty)
        });

        UpdateAstronomy();
        UpdateEconomy();
        UpdateHistory();
        UpdateLiterature();
        UpdateMedicine();
        UpdateMythology();
        UpdateNature();
        UpdateClockworkMechanics();
        UpdateAutomachinery();
        UpdateAugmentation();
        UpdateAlchemy();
        UpdateRunecraft();
        UpdateNpcAttackAtks();
        UpdateNpcAttackSaveDifficulties();
        UpdateMaxMemorisedBlessings();
      });
}

export function UpdateWil() {
    getAttrs(["willpower", "inspiringPresenceBonus"], function(values) {
        let willpower = parseInt(values.willpower)||0;
        let inspiringPresenceBonus = parseInt(values.inspiringPresenceBonus)||0;

        setAttrs({
            "wil": Signed(willpower - 5 + inspiringPresenceBonus)
        });

        UpdatePrayer();
        UpdateSpellwork();
        UpdateSummoning();
        UpdateNpcAttackAtks();
        UpdateNpcAttackSaveDifficulties();
        UpdateSRD();
      });
}