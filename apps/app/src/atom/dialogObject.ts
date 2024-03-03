import { atom } from "recoil";

export const dialogObject = atom({
  key: "dialogObject",
  default: {
    image:"",
    name:""
  },
});