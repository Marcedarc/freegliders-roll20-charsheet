import { Signed } from "../../helpers";
import { UpdateMaxMemorisedBlessings } from "../magic/update-blessings";
import { UpdateCursePowers } from "../magic/update-curses";
import { UpdatePotions } from "../magic/update-potions";
import { UpdateFaith, UpdateHealing } from "../magic/update-prayer";
import { UpdateMaxMemorisedSpells, UpdateSpellSaveDTs, UpdateSRD } from "../magic/update-spells";

export function UpdateAlchemy() {
    getAttrs(["alchemy", "log"], function(values) {
        const skill = parseInt(values.alchemy)||0;
        const stat = parseInt(values.log)||0;

        const mod = skill + stat;

        setAttrs({
            "alchemy": skill,
            "alchemyMod": Signed(mod),
            "alchemyPassive": 10 + mod,
            "show_extractessence": "off" // skill >= 1 ? "on" : "off"
        });
        
        UpdateSpellSaveDTs();
        UpdatePotions();
    });
}

export function UpdatePrayer() {
    getAttrs(["prayer", "wil"], function(values) {
        const skill = parseInt(values.prayer)||0;
        const stat = parseInt(values.wil)||0;

        const mod = skill + stat;

        setAttrs({
            "prayer": skill,
            "prayerMod": Signed(mod),
            "prayerPassive": 10 + mod,
            "show_prayeroffaith": skill >= 1 ? "on" : "off",
            "show_workmiracle": skill >= 2 ? "on" : "off",
            "show_repelunholy": skill >= 4 ? "on" : "off",
            "show_identifycurse": skill >= 5 ? "on" : "off",
            "show_liftcurse": skill >= 5 ? "on" : "off"
        });

        UpdateFaith();
        UpdateHealing();
        UpdateMaxMemorisedBlessings();
        UpdateSpellSaveDTs();
    });
}

export function UpdateRunecraft() {
    getAttrs(["runecraft", "log"], function(values) {
        const skill = parseInt(values.runecraft)||0;
        const stat = parseInt(values.log)||0;

        const mod = skill + stat;

        setAttrs({
            "runecraft": skill,
            "runecraftMod": Signed(mod),
            "runecraftPassive": 10 + mod,
            "show_runereading": skill >= 5 ? "on" : "off"
        });

        UpdateMaxMemorisedSpells();
        UpdateSpellSaveDTs();
    });
}

export function UpdateSpellwork() {
    getAttrs(["spellwork", "wil"], function(values) {
        const skill = parseInt(values.spellwork)||0;
        const stat = parseInt(values.wil)||0;

        const mod = skill + stat;

        setAttrs({
            "spellwork": skill,
            "spellworkMod": Signed(mod),
            "spellworkPassive": 10 + mod,
            "show_sixthsense": skill >= 4 ? "on" : "off",
            "show_counterspell": skill >= 5 ? "on" : "off",
            "show_seventhsense": skill >= 8 ? "on" : "off"
        });

        UpdateMaxMemorisedSpells();
        UpdateCursePowers();
        UpdateSRD();
        UpdateSpellSaveDTs();
    });
}

export function UpdateSummoning() {
    getAttrs(["summoning", "wil"], function(values) {
        const skill = parseInt(values.summoning)||0;
        const stat = parseInt(values.wil)||0;

        const mod = skill + stat;

        setAttrs({
            "summoning": skill,
            "summoningMod": Signed(mod),
            "summoningPassive": 10 + mod,
            "show_subjugatespirit": skill >= 2 && skill < 6 ? "on" : "off",
            "show_subjugatespiritminor": skill >= 6 ? "on" : "off",
            "show_tapintofamiliarsenses": skill >= 3 ? "on" : "off",
            "show_summonspirit": skill >= 4 ? "on" : "off",
            "show_banish": skill >= 7 ? "on" : "off",
            "show_breachtheveil": skill >= 8 ? "on" : "off"
        });
        
        UpdateSpellSaveDTs();
    });
}