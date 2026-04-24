import { GetCustomTemplateResultString } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

on("clicked:sixthsense", SixthSense);
on("clicked:seventhsenseaction", SeventhSenseAction);
on("clicked:counterspell", Counterspell);
on("clicked:seventhsensereaction", SeventhSenseReaction);

function SixthSense() {
    getAttrs(["spellwork"], function(values) {
        let spellworkRanks = parseInt(values["spellwork"]) || 0;

        let rollString = CUSTOM_TEMPLATE_BEGINNING;

        rollString += "{{name=6th Sense}}";

        rollString += "{{action=Major Action}}";

        let range = spellworkRanks >= 8 ? "20m" : "10m";
        rollString += `{{range=${range}}}`;

        rollString += `{{description=You can use a Major Action to sense magic around you. When you do, you sense ongoing spells, blessings, curses, runes, infusions and other magical effects within 10m of you. You can tell how many different magical effects you sense and even where you sense them, but not what they are or do.`;
        
        if(spellworkRanks >= 8) {
            rollString += "\n\n**7th Sense**\nWhen you use your 6th Sense feature, the area is doubled and you can now tell whether the magical effect is a rune or spell effect, a blessing, a curse, an infusion, or something else. You also learn the power or potency of it."    
        }

        rollString += "}}";
        
        startRoll(rollString, (r) => {
            finishRoll(r.rollId);
        });
    });
}

function SeventhSenseAction() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=7th Sense}}";

    rollString += "{{action=Minor Action}}";

    let mod = "+@{spellwork}[Spellwork]@{log}[LOG]";
    rollString += GetCustomTemplateResultString(mod);

    rollString += `{{description=As a Minor Action, you can make a Spellwork [LOG] test to identify specific spells or curses. The difficulty for this test equals 10 + the spell or curse’s power. If you succeed, you have advantage on all tests made to resist the spell or curse’s effect.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}

function SeventhSenseReaction() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=7th Sense}}";

    rollString += "{{action=Minor Reaction}}";

    let mod = "+@{spellwork}[Spellwork]@{log}[LOG]";
    rollString += GetCustomTemplateResultString(mod);

    rollString += `{{description=As a Minor Reaction when a creature you can see or hear casts a spell or inflicts a curse, you can make a Spellwork [LOG] test to identify what spell or curse it is. The difficulty for this test equals 10 + the spell or curse’s power. If you succeed, you have advantage on all tests made to resist the spell or curse’s effect.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}

function Counterspell() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=Counterspell}}";

    rollString += "{{action=Minor Reaction}}";

    let mod = "+@{spellwork}[Spellwork]@{wil}[WIL]";
    rollString += GetCustomTemplateResultString(mod);

    rollString += "{{save=Prayer [WIL] or Spellwork [WIL]}}";

    rollString += `{{description=You can use a Minor Reaction to attempt to interrupt a spell or blessing that another creature is casting or bestowing. Make a Spellwork [WIL] contest against the target's Prayer [WIL] or Spellwork [WIL]. If you succeed, the creature's casting or bestowing is interrupted, and their spell or blessing fails.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}