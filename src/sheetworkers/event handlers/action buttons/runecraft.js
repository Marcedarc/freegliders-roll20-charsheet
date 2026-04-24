import { CUSTOM_TEMPLATE_BEGINNING } from "../../worker-constants";

on("clicked:runereading", RuneReading);

function RuneReading() {
    let rollString = CUSTOM_TEMPLATE_BEGINNING;

    rollString += "{{name=Rune Reading}}";

    rollString += "{{duration=10 minutes}}";

    rollString += `{{description=You can attribute a rune’s handwriting to a creature whose handwriting you have seen before by inspecting it for 10 minutes.}}`;
    
    startRoll(rollString, (r) => {
        finishRoll(r.rollId);
    });
}