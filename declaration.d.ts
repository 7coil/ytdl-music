// https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module
declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss";
