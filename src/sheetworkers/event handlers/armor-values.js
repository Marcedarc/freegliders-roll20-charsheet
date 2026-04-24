import { UpdateDAV, UpdateEquippedShield, UpdateTotalAV } from "../update functions/update-combat";

on("change:torsoTotalAV", UpdateDAV);

on("change:shieldName", UpdateEquippedShield);
on("change:shieldAV", UpdateDAV);

on("change:headAV", UpdateTotalAV);
on("change:leftEyeAV", UpdateTotalAV);
on("change:rightEyeAV", UpdateTotalAV);
on("change:torsoAV", UpdateTotalAV);
on("change:leftArmAV", UpdateTotalAV);
on("change:rightArmAV", UpdateTotalAV);
on("change:leftHandAV", UpdateTotalAV);
on("change:rightHandAV", UpdateTotalAV);
on("change:leftLegAV", UpdateTotalAV);
on("change:rightLegAV", UpdateTotalAV);
on("change:leftFootAV", UpdateTotalAV);
on("change:rightFootAV", UpdateTotalAV);