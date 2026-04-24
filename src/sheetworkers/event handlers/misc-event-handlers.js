import { UpdateBlessings } from "../update functions/magic/update-blessings";
import { UpdateLevelStats } from "../update functions/update-distributers";
import { UpdateMiracleworkingMaximum } from "../update functions/magic/update-prayer";
import { CUSTOM_TEMPLATE_BEGINNING } from "../worker-constants";

on("change:level", UpdateLevelStats);

on("clicked:healing", UseHealing);

on("change:faith", () => {
    UpdateMiracleworkingMaximum();
    UpdateBlessings();
});

function UseHealing() {
    getAttrs(["prayer", "faith"], function(values) {
        let faith = parseInt(values["faith"]) || 0;

        startRoll(CUSTOM_TEMPLATE_BEGINNING + "{{name=Healing}} {{result1=[[@{healing}]]}}", (r) => {
            setAttrs({
                faith: faith - 1
            });
            finishRoll(r.rollId);
        });
    });
}