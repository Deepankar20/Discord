import { atom } from "recoil";

export const currentChat = atom({
  key: "currentChat",
  default: "",
});