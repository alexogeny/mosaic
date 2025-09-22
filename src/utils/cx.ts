type CxValue =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>;

export const cx = (...values: CxValue[]): string => {
  const classes: string[] = [];

  values.forEach((value) => {
    if (!value) {
      return;
    }

    if (typeof value === "string") {
      classes.push(value);
      return;
    }

    Object.entries(value).forEach(([key, active]) => {
      if (active) {
        classes.push(key);
      }
    });
  });

  return classes.join(" ");
};
