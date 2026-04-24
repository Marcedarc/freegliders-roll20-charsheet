import { GetCustomTemplateResultString } from "../../helpers";
import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

on("clicked:prayeroffaith", PrayerOfFaith);
on("clicked:repelunholy", RepelUnholy);
on("clicked:identifycurse", IdentifyCurse);
on("clicked:liftcurse", LiftCurse);
on("clicked:workmiracle", WorkMiracle);

function PrayerOfFaith() {
    getAttrs(["prayer", "faith", "faith_max"], function(values) {
        let prayerRanks = parseInt(values["prayer"]) || 0;
        let faith = parseInt(values["faith"]) || 0;
        let maxFaith = parseInt(values["faith_max"]) || 0;

        let rollString = CUSTOM_TEMPLATE_BEGINNING;

        rollString += "{{name=Prayer of Faith}}";

        rollString += "{{duration=1 hour}}";

        rollString += `{{description=You can spend 1 hour praying to restore your Faith. During that time, you need to stand, kneel or sit still and if you’re interrupted, you have to start over. Once you’re done, you regain [[${prayerRanks}]] Faith points.\n\nIf you’re on consecrated grounds, like in a church, chapel, monastery, or similar space, you gain double the amount of Faith through this process.}}`;

        startRoll(rollString, (r) => {
            setAttrs({
                "faith": Math.min(maxFaith, faith + prayerRanks)
            });

            finishRoll(r.rollId);
        });
    });
}

function RepelUnholy() {
    getAttrs(["prayer", "faith"], function(values) {
        let prayerRanks = parseInt(values["prayer"]) || 0;
        let faith = parseInt(values["faith"]) || 0;

        if(faith < 1) {
            return;
        }

        let rollString = CUSTOM_TEMPLATE_BEGINNING;

        rollString += "{{name=Repel the Unholy}}";

        rollString += "{{action=Major Action}}";

        rollString += "{{area=10m around you}}";

        rollString += "{{duration=1 minute}}";

        rollString += `{{save=DT [[10+${prayerRanks}[Prayer Skill Ranks]]] Willpower test}}`;

        rollString += `{{description=You can use a Major Action spending 1 Faith to repel unholy creatures within 10m of you for 1 minute. Every unholy creature in the area when you use this feature, or when they first enter the area or start their turn in it must make a Willpower test against [[10+${prayerRanks}[Prayer Skill Ranks]]]. If they fail, they become frightened by you until the end of the duration. The effect ends prematurely if you become incapacitated or if you end it at any moment, no action required.}}`;

        startRoll(rollString, (r) => {
            setAttrs({
                "faith": faith - 1
            });

            finishRoll(r.rollId);
        });
    });
}

function IdentifyCurse() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=Identify Curse}}";

    rollString += "{{action=Major Action}}";

    rollString += "{{target=1 creature or object}}";

    let mod = "+@{prayer}[Prayer]@{wil}[WIL]";
    rollString += GetCustomTemplateResultString(mod);

    rollString += `{{description=You can use a Major Action to make a Prayer [WIL] test to identify any curses that afflict a creature or object. Any curse with a power equal to or lower than your result is revealed to you and you learn what it does.}}`;

    startRoll(rollString, (r) => {

        finishRoll(r.rollId);
    });
}

function LiftCurse() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=Lift Curse}}";

    rollString += "{{action=Major Action}}";

    rollString += "{{target=1 creature or object}}";

    let mod = "+@{prayer}[Prayer]@{wil}[WIL]";
    rollString += GetCustomTemplateResultString(mod);

    rollString += `{{description=You can use a Major Action to make a Prayer [WIL] test to attempt to lift a curse that's afflicting a creature or object that you have identified first. The Difficulty for this test is equal to 10 + the curse's power.\n\nYou can expend an amount of Faith up to your Prayer skill Ranks to gain a +1 bonus on that test for each Faith point expended. You can do that after rolling your test but before knowing whether it is successful or not.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}

function WorkMiracle() {
    getAttrs(["prayer", "faith"], function(values) {
        let prayerRanks = parseInt(values["prayer"]) || 0;
        let faith = parseInt(values["faith"]) || 0;

        if(faith < 1) {
            return;
        }

        let rollString = CUSTOM_TEMPLATE_BEGINNING;

        rollString += "{{name=Work Miracle}}";

        rollString += "{{action=Minor Reaction}}";

        rollString += "{{target=1 creature}}";

        rollString += "{{range=20m}}";

        rollString += "{{result=+[[?{How much Faith?";
        for(let i = 1; i <= prayerRanks; i++) {
            rollString += `|${i} Faith,${i}`;
        }
        rollString += "}]] Power}}";

        rollString += `{{description=You can use a Minor Reaction when a creature you can see or hear within 20m of you casts a spell using Spellwork to expend Faith up to your Prayer skill ranks to increase the spell’s power by an amount equal to the Faith expended.}}`;
        
        startRoll(rollString, (r) => {
            setAttrs({
                "faith": faith - r.results["result"].result
            });

            finishRoll(r.rollId);
        });
    });
}