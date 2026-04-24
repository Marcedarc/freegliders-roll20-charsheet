import { DamageStringToTemplateRollString, GetCustomTemplateAtkString, Signed } from "../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../worker-constants";

const ATTRIBUTE_MOD_TAGS = {
    Agility: "[AGI]",
    Body: "[BOD]",
    Charisma: "[CHA]",
    Intuition: "[INT]",
    Logic: "[LOG]",
    Willpower: "[WIL]"
};

export function RollNpcAttack(eventInfo) {
    const rowId = eventInfo.sourceAttribute.split("_")[2];
    const prefix = "repeating_npcAttack_" + rowId + "_npc_attack_";

    getAttrs(
        [
            prefix + "name",                // Name
            prefix + "type",                // Melee / Ranged / Special
            prefix + "type2",               // Weapon / Unarmed / Spell / Innate
            prefix + "isAttackTest",        // isAttackTest Checkbox
            prefix + "requiresSave",        // requiresSave Checkbox
            prefix + "atk",                 // ATK
            prefix + "difficulty",          // DT
            prefix + "saveAttribute",       // Save Attribute
            prefix + "saveSkill",           // Save Skill
            prefix + "damage",              // Damage
            prefix + "description"          // Description
        ],
        function(values) {
            let name = values[prefix + "name"] || "";
            let type = values[prefix + "type"] || "";
            let type2 = values[prefix + "type2"] || "";
            let isAttackTest = values[prefix + "isAttackTest"] == "on";
            let requiresSave = values[prefix + "requiresSave"] == "on";
            let atk = values[prefix + "atk"] || "";
            let difficulty = values[prefix + "difficulty"] || "";
            let saveAttribute = values[prefix + "saveAttribute"] || "";
            let saveSkill = values[prefix + "saveSkill"] || "";
            let damage = values[prefix + "damage"] || "";
            let description = values[prefix + "description"] || "";

            let roll = CUSTOM_TEMPLATE_BEGINNING;

            roll += "{{name=" + name + "}}";
            roll += "{{type=" + type + " " + type2 + "}}";

            // Attack Test
            if(isAttackTest) {
                roll += GetCustomTemplateAtkString(atk);
            }

            // Save Test
            if(requiresSave) {
                roll += "{{save=DT " + difficulty;

                if(saveSkill == "Evasion") {
                    roll += " Evasion";
                }
                else if(saveSkill != "none") {
                    roll += " " + saveSkill + " " + ATTRIBUTE_MOD_TAGS[saveAttribute];
                }
                else {
                    roll += " " + saveAttribute;
                }

                roll += "}}";
            }

            // Damage Roll
            if(damage != "") {
                roll += DamageStringToTemplateRollString(damage);
            }

            // Description
            if(description != "") {
                roll += "{{description=" + description + "}}";
            }

            startRoll(roll, (r) => {
                finishRoll(r.rollId);
            });
        }
    );
}

export function UpdateNpcAttackAtks() {
    getSectionIDs("npcAttack", function(ids) {
        for(let rowId of ids) {
            DoUpdateNpcAttackAtk(rowId);
        }
    });
}

export function UpdateNpcAttackAtk(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];
    DoUpdateNpcAttackAtk(rowId);
}

function DoUpdateNpcAttackAtk(rowId) {
    let prefix = "repeating_npcAttack_" + rowId + "_npc_attack_";

    getAttrs([prefix + "atkMod", prefix + "atkAttribute", "agi", "bod", "cha", "int", "log", "wil"], function (values){
        let atkMod = parseInt(values[prefix + "atkMod"]) || 0;
        let atkAttribute = values[prefix + "atkAttribute"] || "";
        let attributeMods = {
            Agility      : parseInt(values["agi"]) || 0,
            Body         : parseInt(values["bod"]) || 0,
            Charisma     : parseInt(values["cha"]) || 0,
            Intelligence : parseInt(values["int"]) || 0,
            Logic        : parseInt(values["log"]) || 0,
            Willpower    : parseInt(values["wil"]) || 0
        };

        let atk = atkMod;

        if(atkAttribute != "" && atkAttribute != "none") {
            atk += attributeMods[atkAttribute];
        }

        let attributes = {};
        attributes[prefix + "atk"] = Signed(atk);

        setAttrs(attributes);
    });
}

export function UpdateNpcAttackSaveDifficulties() {
    getSectionIDs("npcAttack", function(ids) {
        for(let rowId of ids) {
            DoUpdateNpcAttackSaveDifficulty(rowId);
        }
    });
}

export function UpdateNpcAttackSaveDifficulty(eventInfo) {
    if(eventInfo.previousValue === eventInfo.newValue) {
        return;
    }
    
    let rowId = eventInfo.sourceAttribute.split("_")[2];
    DoUpdateNpcAttackSaveDifficulty(rowId);
}

function DoUpdateNpcAttackSaveDifficulty(rowId) {
    let prefix = "repeating_npcAttack_" + rowId + "_npc_attack_";

    getAttrs([prefix + "difficultyMod", prefix + "difficultyAttribute", "agi", "bod", "cha", "int", "log", "wil"], function (values){
        let difficultyMod = parseInt(values[prefix + "difficultyMod"]) || 0;
        let difficultyAttribute = values[prefix + "difficultyAttribute"] || "";
        let attributeMods = {
            Agility      : parseInt(values["agi"]) || 0,
            Body         : parseInt(values["bod"]) || 0,
            Charisma     : parseInt(values["cha"]) || 0,
            Intelligence : parseInt(values["int"]) || 0,
            Logic        : parseInt(values["log"]) || 0,
            Willpower    : parseInt(values["wil"]) || 0
        };

        let difficulty = 0;
        difficulty += difficultyMod;

        if(difficultyAttribute != "" && difficultyAttribute != "none") {
            difficulty += attributeMods[difficultyAttribute];
        }

        let attributes = {};
        attributes[prefix + "difficulty"] = difficulty;

        setAttrs(attributes);
    });
}