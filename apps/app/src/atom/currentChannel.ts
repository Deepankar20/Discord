import { atom } from "recoil";

export const currentChannel = atom({
  key: "currentChannel",
  default: 0,
});