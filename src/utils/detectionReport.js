export function toTextList(list) {
  if (!Array.isArray(list)) return []

  return list
    .map((item) => {
      if (item && typeof item === "object") {
        return item.name ?? item.label ?? item.title ?? item.text ?? ""
      }

      return item == null ? "" : String(item)
    })
    .filter((item) => item !== "")
}

export function normalizeDetectionSection(section) {
  if (!section || typeof section !== "object") {
    return {
      name: [],
      value: [],
      result: [],
      level: [],
    }
  }

  return {
    ...section,
    name: toTextList(section.name),
    value: Array.isArray(section.value) ? section.value : [],
    result: Array.isArray(section.result) ? section.result : [],
    level: Array.isArray(section.level) ? section.level : [],
  }
}
