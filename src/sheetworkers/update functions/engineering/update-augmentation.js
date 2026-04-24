import { Signed } from "../../helpers";

export function UpdateAugmentAV(eventInfo) {
    let bodyPart = eventInfo.sourceAttribute.split("_")[1];

    getAttrs(
        [
            "augmentations_" + bodyPart + "_quality",
            "augmentations_" + bodyPart
        ],
        function(values) {
            let quality = parseInt(values["augmentations_" + bodyPart + "_quality"]) || 0;
            let augmentation = values["augmentations_" + bodyPart] || "";

            let attributes = {};

            if(augmentation == "prosthetic" || augmentation == "autolimb") {
                attributes[bodyPart + "AugmentAV"] = Signed(quality);
            }
            else {
                attributes[bodyPart + "AugmentAV"] = "+0";
            }

            setAttrs(attributes);
        }
    );
}

export function UpdateAugmentModuleCapacity(eventInfo) {
    let bodyPart = eventInfo.sourceAttribute.split("_")[1];

    getAttrs(
        [
            "augmentations_" + bodyPart + "_quality"
        ],
        function(values) {
            let quality = parseInt(values["augmentations_" + bodyPart + "_quality"]) || 0;

            let attributes = {};

            attributes["augmentations_" + bodyPart + "_moduleCapacity"] = Math.floor(quality / 2);

            if(bodyPart == "leftEye" || bodyPart == "rightEye" || bodyPart == "jaw") {
                attributes["augmentations_" + bodyPart + "_moduleCapacity"] += 1;
            }
            else if(bodyPart == "leftFoot" || bodyPart == "rightFoot" || bodyPart == "leftHand" || bodyPart == "rightHand" || bodyPart == "head") {
                attributes["augmentations_" + bodyPart + "_moduleCapacity"] += 2;
            }
            else if(bodyPart == "leftLeg" || bodyPart == "rightLeg" || bodyPart == "leftArm" || bodyPart == "rightArm") {
                attributes["augmentations_" + bodyPart + "_moduleCapacity"] += 3;
            }
            else if(bodyPart == "torso") {
                attributes["augmentations_" + bodyPart + "_moduleCapacity"] += 4;
            }

            setAttrs(attributes);
        }
    );
}