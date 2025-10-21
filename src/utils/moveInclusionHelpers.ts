export function changeInclusion(inclusion: true | false | "indeterminate") {
  if (inclusion === "indeterminate") return true;
  if (inclusion === true) return false;
  return "indeterminate";
}
