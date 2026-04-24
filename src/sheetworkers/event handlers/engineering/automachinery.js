import { UpdateAutomatonPlating, UpdateAutomatonStats } from "../../update functions/engineering/update-automachinery";

on("change:repeating_automaton:automaton_plating", UpdateAutomatonPlating);
on("change:repeating_automaton:automaton_quality", UpdateAutomatonStats);
on("change:repeating_automaton:automaton_chassis", UpdateAutomatonStats);