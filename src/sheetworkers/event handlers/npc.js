import { RollNpcAttack, UpdateNpcAttackAtk, UpdateNpcAttackSaveDifficulty } from "../npc/npc";

on("clicked:repeating_npcAttack:npcattackrollbutton", RollNpcAttack);
on("change:repeating_npcAttack:npc_attack_atkMod", UpdateNpcAttackAtk);
on("change:repeating_npcAttack:npc_attack_atkAttribute", UpdateNpcAttackAtk);
on("change:repeating_npcAttack:npc_attack_difficultyMod", UpdateNpcAttackSaveDifficulty);
on("change:repeating_npcAttack:npc_attack_difficultyAttribute", UpdateNpcAttackSaveDifficulty);