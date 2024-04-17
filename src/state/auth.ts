import { atom } from "jotai";

export type UserInfo = {
  firstName: string;
  lastName: string;
  picture: string;
};

export const authAtom = atom({
  firstName: "",
  lastName: "",
  picture: "",
} as UserInfo);
