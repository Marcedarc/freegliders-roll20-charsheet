import { Signed } from "../helpers";

export function UpdateEvasion() {
    getAttrs(["agi", "int", "quickReflexesBonus"], function(values) {
        let agi = parseInt(values.agi)||0;
        let int = parseInt(values.int)||0;
        let quickReflexesBonus = parseInt(values.quickReflexesBonus)||0;

        setAttrs({
            "evasion": Signed(agi+int+quickReflexesBonus)
        });
    });
}

export function UpdateDAV() {
    getAttrs(
        [
            "torsoTotalAV",
            "shieldAV",
            "shield"
        ],
        function(values) {
            let torsoAV = parseInt(values.torsoTotalAV)||0;
            let shieldAV = values.shieldAV || "0";
            let shield = parseInt(values.shield)||0;

            let effectiveAV;
            let splitAV = shieldAV.split("(");
            if(splitAV.length === 1) {
                effectiveAV = parseInt(shieldAV) || 0;
            }
            else if(shield >= 5) {
                effectiveAV = parseInt(splitAV[1].replace(")", "")) || 0;
            }
            else {
                effectiveAV = parseInt(shieldAV) || 0;
            }

            setAttrs({
                dav: torsoAV + effectiveAV
            });
        }
    );
}

export function UpdateEquippedShield() {
    let shields = {
        "buckler": {
            av: "1",
            type: "Light"
        },
        "round shield": {
            av: "2",
            type: "Light"
        },
        "kite shield": {
            av: "2 (3)",
            type: "Heavy"
        },
        "tower shield": {
            av: "2 (4)",
            type: "Heavy"
        }
    };

    getAttrs(["shieldName"], function(values) {
        let shieldName = values.shieldName || "";

        let listShield = shields[shieldName.toLowerCase()];
        
        if(listShield !== undefined) {
            setAttrs({
                shieldAV: listShield.av,
                shieldType: listShield.type
            });
        }
    });
}

export function UpdateHP() {
    getAttrs(["body", "level", "hitdie", "toughBonus", "fragilePenalty"], function(values) {
        let body = parseInt(values.body)||0;
        let level = parseInt(values.level)||0;
        let hitdie = values.hitdie||"d0";
        let hitdieMax = parseInt(hitdie.substring(1))||0;
        let toughBonus = parseInt(values.toughBonus)||0;
        let fragilePenalty = parseInt(values.fragilePenalty)||0;

        setAttrs({
            "hp_max": ((hitdieMax/2)+body+toughBonus+fragilePenalty)*level
        });
    });
}

export function UpdateHitDie() {
    getAttrs(["athletics"], function(values) {
        let athletics = parseInt(values.athletics)||0;
        let hitDice = ["d4", "d6", "d8", "d10", "d12", "d20"];

        setAttrs({
            "hitdie": hitDice[Math.floor(athletics/3)+1]
        });

        UpdateHP();
    });
}

export function UpdateInitiative() {
    getAttrs(["agi", "int"], function(values) {
        let agi = parseInt(values.agi)||0;
        let int = parseInt(values.int)||0;

        setAttrs({
            "initiative": Signed(agi+int)
        });
    });
}

export function UpdateUnarmedStrike() {
    getAttrs(["bod", "brawlingMod", "brawling"], function(values) {
        let bod = parseInt(values.bod)||0;
        let brawlingMod = parseInt(values.brawlingMod)||0;
        let brawling = parseInt(values.brawling)||0;

        let martialArtsDice = Math.floor((brawling+2)/3);
        let martialArtsDamage = "";
        if(martialArtsDice > 0) {
            martialArtsDamage = "" + martialArtsDice + "d4 + ";
        }

        setAttrs({
            "unarmedStrike_atk": Signed(brawlingMod),
            "unarmedStrike_damage": martialArtsDamage + Math.max(1, bod) + " Blunt"
        });
    });
}

export function UpdateTotalAV(eventInfo) {
    let bodyPart = "";
    if(eventInfo.sourceAttribute.search("augment") > -1) {
        bodyPart = eventInfo.sourceAttribute.substring(0, eventInfo.sourceAttribute.length-9);
    }
    else {
        bodyPart = eventInfo.sourceAttribute.substring(0, eventInfo.sourceAttribute.length-2);
    }

    getAttrs(
        [
            bodyPart + "AV",
            bodyPart + "AugmentAV"
        ],
        function(values) {
            let baseAV = parseInt(values[bodyPart + "AV"]) || 0;
            let augmentAV = parseInt(values[bodyPart + "AugmentAV"]) || 0;

            let attributes = {};

            attributes[bodyPart + "TotalAV"] = baseAV + augmentAV;

            setAttrs(attributes);
        }
    );
}