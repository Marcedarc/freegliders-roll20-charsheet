import {CUSTOM_TEMPLATE_BEGINNING} from '../worker-constants';

on("clicked:hitdie", function() {
    let rollString = `${CUSTOM_TEMPLATE_BEGINNING}{{name=Hit Dice}} {{result1=[[?{Number of Hit Dice|1}@{hitdie}]]}}`;
    startRoll(rollString, r => {
        finishRoll(r.rollId);
    });
});