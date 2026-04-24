export function UpdateMiracleworkingMaximum() {
    getAttrs(["faith", "prayer", "miracleworkingFaith"], function(values) {
        const faith = parseInt(values.faith) || 0;
        const prayer = parseInt(values.prayer) || 0;
        const miracleworkingFaith = parseInt(values.miracleworkingFaith) || 0;

        const newMax = Math.min(prayer, faith);

        setAttrs({
            miracleworkingFaith_max: newMax,
            miracleworkingFaith: Math.min(miracleworkingFaith, newMax)
        });
    });
}

export function UpdateFaith() {
    getAttrs(["willpower", "prayer"], function(values) {
        const willpower = parseInt(values.willpower) || 0;
        const prayer = parseInt(values.prayer) || 0;

        setAttrs({
            faith_max: willpower * prayer
        });

        UpdateMiracleworkingMaximum();
    });
}

export function UpdateHealing() {
    getAttrs(["prayer"], function(values) {
        const prayer = parseInt(values.prayer)||0;

        let healing = "0";

        if(prayer >= 3) {
            healing = "" + Math.floor(prayer / 3) + "d6 + " + prayer;
        }

        setAttrs({
            healing: healing
        });
    });
}