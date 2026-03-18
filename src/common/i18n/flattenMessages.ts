type NestedMessages = { [key: string]: string | NestedMessages };

/**
 * Converte um objeto JSON aninhado em um Record plano de chave→valor.
 *
 * @example
 * flattenMessages({ nav: { home: "Home" } })
 * // → { "nav.home": "Home" }
 */
export function flattenMessages(
  messages: NestedMessages,
  prefix = "",
): Record<string, string> {
  return Object.entries(messages).reduce(
    (acc, [key, value]) => {
      const flatKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        acc[flatKey] = value;
      } else {
        Object.assign(acc, flattenMessages(value, flatKey));
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
