import { AllergenesInIngredients } from "../src/day21";
import { isEqual } from "../src/set_utils";


test("Mapping ", () => {
    const mapping = new AllergenesInIngredients();

    mapping.add_information(["mxmxvkd", "kfcds", "sqjhc", "nhms"], ["dairy", "fish"]);
    mapping.add_information(["trh", "fvjkl", "sbzzf", "mxmxvkd"], ["dairy"]);
    mapping.add_information(["sqjhc", "fvjkl"], ["soy"]);
    mapping.add_information(["sqjhc", "mxmxvkd", "sbzzf"], ["fish"]);

    const no_allergenes = mapping.ingredients_without_allergenes();

    expect(isEqual(no_allergenes.ingredients, new Set(["kfcds", "nhms", "sbzzf", "trh"]))).toBeTruthy();
    expect(no_allergenes.number_of_appearances).toBe(5);
})