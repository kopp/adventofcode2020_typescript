import { read_file_of_strings } from "./read_file_utils";
import { intersect } from "./set_utils";


export class AllergenesInIngredients
{
    // allergene -> ingredients which might contain the allergene
    may_contain = new Map<string, Set<string>>();
    contains = new Map<string, string>();
    // ingredient -> number of occurances
    known_ingredient_occurances = new Map<string, number>();

    add_information(ingredients: Array<string>, allergenes: Array<string>): void
    {
        for (const ingredient of ingredients) {
            let current;
            if (this.known_ingredient_occurances.has(ingredient)) {
                current = this.known_ingredient_occurances.get(ingredient)!;
            }
            else {
                current = 0;
            }
            this.known_ingredient_occurances.set(ingredient, current + 1);
        }

        for (const allergene of allergenes) {
            if (this.may_contain.has(allergene)) {
                const ingredients_marked_multiple_times_to_contain_the_allergenes = intersect(ingredients, this.may_contain.get(allergene)!);
                if (ingredients_marked_multiple_times_to_contain_the_allergenes.size == 1) {
                    const ingredient_containing_allergene = ingredients_marked_multiple_times_to_contain_the_allergenes.values().next().value;
                    this.store_known_relation(ingredient_containing_allergene, allergene);
                }
                else {
                    this.may_contain.set(allergene, ingredients_marked_multiple_times_to_contain_the_allergenes);
                }
            }
            else {
                this.may_contain.set(allergene, new Set(ingredients));
            }
        }
    }

    store_known_relation(ingredient: string, allergene: string)
    {
        this.contains.set(allergene, ingredient);
        this.may_contain.delete(allergene);
        for (const [other_allergene, possible_containers] of this.may_contain) {
            if (possible_containers.has(ingredient)) {
                possible_containers.delete(ingredient);
                if (possible_containers.size == 1) {
                    const new_known_ingredient = possible_containers.values().next().value;
                    this.store_known_relation(new_known_ingredient, other_allergene);
                }
            }

        }
    }

    ingredients_without_allergenes(): { ingredients: Set<string>, number_of_appearances: number }
    {
        const ingredients = new Set([...this.known_ingredient_occurances.keys()]);
        for (const [other_allergene, possible_containers] of this.may_contain) {
            for (const ingredient in possible_containers) {
                ingredients.delete(ingredient);
            }
        }
        for (const [other_allergene, known_container] of this.contains) {
            ingredients.delete(known_container);
        }

        let count = 0;
        for (const ingredient of ingredients) {
            count += this.known_ingredient_occurances.get(ingredient)!;
        }

        return { ingredients: ingredients, number_of_appearances: count };
    }

    canonical_dangerous_ingredient_list(): string
    {
        const allergenes = [...this.contains.keys()];
        const allergenes_sorted = allergenes.sort();

        const ingredients = allergenes_sorted.map((allergene) => this.contains.get(allergene));
        const list = ingredients.join(",");
        return list;
    }

}



export function find_allergene_free_ingredients(input: Array<string>): AllergenesInIngredients
{
    const mapping = new AllergenesInIngredients();

    for (const line of input) {
        const match = line.match(/^(.*) \(contains (.*)\)$/);
        if (match == null) {
            throw new Error(`Unable to parse line ${line}.`);
        }
        const ingredients = match[1].split(" ");
        const allergenes = match[2].split(", ");
        mapping.add_information(ingredients, allergenes);
    }

    return mapping;
}



if (require.main === module) {
    const input = read_file_of_strings("input/day21");
    const mapping = find_allergene_free_ingredients(input);

    const ingredients_without_allergenes = mapping.ingredients_without_allergenes();
    const count = ingredients_without_allergenes.number_of_appearances;

    console.log("Problem 1: ", count);

    console.log("Problem 2: ", mapping.canonical_dangerous_ingredient_list());
}