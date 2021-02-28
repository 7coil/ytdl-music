const combineStyles = (styles: string[]): string => {
  return styles
    .filter(
      (style) => style !== "" && style !== null && typeof style !== "undefined"
    )
    .join(" ");
};

export { combineStyles };
