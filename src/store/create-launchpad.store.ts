import { StateCreator } from "zustand";

interface IState {
  createPage: number;
  createUploadedJson: any[];
  createUploadedCsv: any[];
  createUploadedImages: File[];
  collectionBanner: string | null | undefined;
  jsonManifestId: null | string | undefined;
  csvManifestId: null | string | undefined;
  imageManifestId: null | string | undefined;
}

const initialState: IState = {
  createPage: 0,
  createUploadedJson: [],
  createUploadedCsv: [],
  createUploadedImages: [],
  collectionBanner: undefined,
  jsonManifestId: undefined,
  csvManifestId: undefined,
  imageManifestId: undefined,
  //TODO: add uploaded csv and manifest csv id here
};

interface IActions {
  setCreatePage: (value: number) => void;
  setCreateUploadedJson: (value: any[]) => void;
  setCreateUploadedCsv: (value: any[]) => void;
  setCreateUploadedImages: (value: File[]) => void;
  setCollectionBanner: (value: string) => void;
  setJsonManifestId: (value: string) => void;
  setCsvManifestId: (value: string) => void;
  setImageManifestId: (value: string) => void;
  resetCreatePage: () => void;
  //TODO: add uploaded csv and manifest csv id here
}

export type ICreateLaunchpadStore = IState & IActions;

export const createLauncpadStore: StateCreator<ICreateLaunchpadStore> = (
  set
) => ({
  resetCreatePage: () => {
    set(initialState);
  },
  setCreateUploadedImages: (value) =>
    set(() => ({ createUploadedImages: value })),
  setCollectionBanner: (value) => set(() => ({ collectionBanner: value })),
  setJsonManifestId: (value) => set(() => ({ jsonManifestId: value })),
  setCsvManifestId: (value) => set(() => ({ csvManifestId: value })),
  setImageManifestId: (value) => set(() => ({ imageManifestId: value })),
  setCreateUploadedJson: (value) => set(() => ({ createUploadedJson: value })),
  setCreateUploadedCsv: (value) => set(() => ({ createUploadedCsv: value })),
  setCreatePage: (value) => set(() => ({ createPage: value })),
  ...initialState,
  //TODO: add uploaded csv and manifest csv id here
});
