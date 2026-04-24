import { GetCustomTemplateResultString } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

on("clicked:subjugatespirit", SubjugateSpirit);
on("clicked:tapintofamiliarsenses", TapIntoFamiliarSenses);
on("clicked:summonspirit", () => { SummonSpirit("Spirit"); });
on("clicked:banish", Banish);
on("clicked:summondemon", () => { SummonSpirit("Demon"); });
on("clicked:summonangel", () => { SummonSpirit("Angel"); });

function SubjugateSpirit() {
    getAttrs(["summoning", "wil"], function(values) {
        let summoningRanks = parseInt(values["summoning"]) || 0;
        let wil = parseInt(values["wil"]) || 0;

        let rollString = CUSTOM_TEMPLATE_BEGINNING;

        rollString += "{{name=Subjugate Spirit}}";

        rollString += "{{range=10m}}";
        
        let action = summoningRanks < 6 ? "Major" : "Minor";
        rollString += `{{action=${action} Action}}`;

        let mod = "+@{summoning}[Summoning]@{wil}[WIL]";
        rollString += GetCustomTemplateResultString(mod);

        if(summoningRanks < 6) {
            rollString += `{{duration=[[@{summoning}[Summoning]]] minutes}}`;
        }
        else if(summoningRanks < 8) {
            rollString += `{{duration=[[@{summoning}[Summoning] * 10]] minutes}}`;
        }
        else {
            rollString += `{{duration=[[@{summoning}[Summoning]]] hours}}`;
        }

        rollString += "{{save=Willpower test}}";

        if(summoningRanks < 6) {
            rollString += "{{description=As a Major Action, you can attempt to subdue a spirit within 10m of you. Make a Summoning [WIL] test contested by the spirit’s Willpower test. On a success, the spirit is subdued and must now follow your commands until [[@{summoning}[Summoning]]] minutes have passed. You can only subdue up to [[@{summoning}[Summoning]]] spirits at once. You can end your subjugation on a spirit at any point, requiring no action.}}";
        }
        else if(summoningRanks < 8) {
            rollString += `{{description=As a Minor Action, you can attempt to subdue up to [[${Math.max(1, wil)}]] spirits within 10m of you. Make a Summoning [WIL] test contested by the spirit’s Willpower test. On a success, the spirit is subdued and must now follow your commands until [[@{summoning}[Summoning] * 10]] minutes have passed. You can only subdue up to [[@{summoning}[Summoning]]] spirits at once. You can end your subjugation on a spirit at any point, requiring no action.}}`;
        }
        else {
            rollString += `{{description=As a Minor Action, you can attempt to subdue up to [[${Math.max(1, wil)}]] spirits within 10m of you. Make a Summoning [WIL] test contested by the spirit’s Willpower test. On a success, the spirit is subdued and must now follow your commands until [[@{summoning}[Summoning]]] hours have passed. You can only subdue up to [[@{summoning}[Summoning]]] spirits at once. You can end your subjugation on a spirit at any point, requiring no action.}}`;
        }
        
        startRoll(rollString, (r) => {
            finishRoll(r.rollId);
        });
    });
}

function TapIntoFamiliarSenses() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=Tap into Familiar's Senses}}";

    rollString += "{{action=Major Action}}";

    rollString += `{{description=You can use a Major Action to tap into your familiar’s senses while it is within 100m of you. When you do so, you become blind and deaf to your own surroundings and see and hear through the familiar’s eyes and ears, gaining any benefits to tests made related to those senses that the familiar has. You can end this state at any point, requiring no action. This state also ends if the familiar ends up somewhere further than 100m away from you.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}

function SummonSpirit(spiritType) {
    getAttrs(["summoning", "wil", "essence_air", "essence_earth", "essence_fire", "essence_water"], function(values) {
        let summoningRanks = parseInt(values["summoning"]) || 0;
        let wil = parseInt(values["wil"]) || 0;
        
        let airEssence = parseInt(values["essence_air"]) || 0;
        let earthEssence = parseInt(values["essence_earth"]) || 0;
        let fireEssence = parseInt(values["essence_fire"]) || 0;
        let waterEssence = parseInt(values["essence_water"]) || 0;

        let rollString = CUSTOM_TEMPLATE_BEGINNING;

        rollString += "{{duration=1 hour}}";

        rollString += "{{range=10m}}";

        // Power Level
        rollString += "{{powerlevel=[[?{Power Level";
        
        let maxPL = Math.min(summoningRanks + wil, airEssence, earthEssence, fireEssence, waterEssence);
        if(maxPL < 1) {
            return;
        }

        for(let i = 0; i <= maxPL; i++) {
            rollString += `|PL ${i},${i}`;
        }

        rollString += "}]]}}";
        
        rollString += `{{name=Summon ${spiritType} [PL ?{Power Level}]}}`;

        rollString += `{{description=You can spend 1 hour performing a summoning ritual to summon a ${spiritType} with a Power Level up to [[@{summoning}[Summoning] @{wil}[WIL]]]. You have to expend essence of each element equal to the Power Level of the ${spiritType} (minimum of 1 each). If your ritual is interrupted, you don't lose the essence, but you have to start over. At the end of the ritual, the essence is consumed and the ${spiritType} appears in an unoccupied space within 10m of you. A summoned ${spiritType} is not automatically compelled to follow your commands and returns to where it came from instantly after a number of hours equal to the ${spiritType}'s power level (minimum of 1 hour) has passed.}}`;
        
        startRoll(rollString, (r) => {
            let powerlevel = r.results.powerlevel.result;

            setAttrs({
                essence_air: airEssence - Math.max(1, powerlevel),
                essence_earth: earthEssence - Math.max(1, powerlevel),
                essence_fire: fireEssence - Math.max(1, powerlevel),
                essence_water: waterEssence - Math.max(1, powerlevel)
            });

            finishRoll(r.rollId);
        });
    });
}

function Banish() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=Banish}}";

    rollString += "{{action=Major Reaction}}";

    let mod = "+@{summoning}[Summoning] @{wil}[WIL]";
    rollString += GetCustomTemplateResultString(mod);

    rollString += "{{save=Willpower test}}";

    rollString += `{{description=You can use a Major Action to make a Summoning [WIL] contest against the target's Willpower test. The target must be within 20m of you and you must be able to speak clearly. If you succeed, the target disappears and is sent back to its native plane. You can also use this feature on such a creature that is possessing another creature. If you do so and you're successful, the target creature is not banished, but instead forced to leave the host and appear in the nearest unoccupied space next to the host.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}