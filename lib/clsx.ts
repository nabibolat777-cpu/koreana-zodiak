/** Tiny className joiner so we don't need an extra dependency. */
export function clsx(
  ...args: Array<string | number | false | null | undefined>
): string {
  return args.filter(Boolean).join(" ");
}
