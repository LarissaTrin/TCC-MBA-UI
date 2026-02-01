import { AutocompleteOption } from "../model";

type IdName = { id: string; name: string };

export const mapToOptions = <T extends IdName>(
  items: T[],
): AutocompleteOption[] =>
  items.map((item) => ({
    value: item.id,
    label: item.name,
  }));
