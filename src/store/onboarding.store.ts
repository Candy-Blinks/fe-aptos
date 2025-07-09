import { StateCreator } from "zustand";

interface CreateUserPayload {
  address: string;
  referralCode?: string;
  profilePic: string;
  username: string;
}
interface IState {
  onboardingPageNumber: number;
  referralCodeValidated: boolean;

  onboardingPayload: CreateUserPayload;
}

const initialState: IState = {
  onboardingPageNumber: 0,
  referralCodeValidated: false,
  onboardingPayload: {
    address: "",
    referralCode: undefined,
    profilePic: "",
    username: "",
  },
};

interface IActions {
  setOnboardingPageNumber: (value: number) => void;
  setReferralCodeValidated: (value: boolean) => void;
  setOnboardingPayload: (value: CreateUserPayload) => void;
}

export type IOnboardingStore = IState & IActions;

export const onboardingStore: StateCreator<IOnboardingStore> = (set) => ({
  setOnboardingPayload: (value) =>
    set(() => ({ onboardingPayload: { ...value } })),
  setReferralCodeValidated: (value) =>
    set(() => ({ referralCodeValidated: value })),
  setOnboardingPageNumber: (value) =>
    set(() => ({ onboardingPageNumber: value })),
  ...initialState,
});
