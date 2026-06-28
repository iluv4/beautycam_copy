"use client";

import { create } from "zustand";

export type BoothMode = "concept" | "freeform";

type BoothState = {
  themeId: string | null;
  characterId: string | null;
  // data URLs of the uploaded photos
  characterPhoto: string | null;
  myPhoto: string | null;
  mode: BoothMode;
  conceptId: string | null;
  freeText: string;

  // generated result
  resultImage: string | null;
  resultMeta: { themeId: string; characterId: string | null } | null;

  setTheme: (id: string) => void;
  setCharacter: (id: string | null) => void;
  setCharacterPhoto: (url: string | null) => void;
  setMyPhoto: (url: string | null) => void;
  setMode: (m: BoothMode) => void;
  setConcept: (id: string | null) => void;
  setFreeText: (t: string) => void;
  setResult: (img: string, meta: { themeId: string; characterId: string | null }) => void;
  resetBooth: () => void;
};

export const useBooth = create<BoothState>((set) => ({
  themeId: null,
  characterId: null,
  characterPhoto: null,
  myPhoto: null,
  mode: "concept",
  conceptId: null,
  freeText: "",
  resultImage: null,
  resultMeta: null,

  setTheme: (id) => set({ themeId: id }),
  setCharacter: (id) => set({ characterId: id }),
  setCharacterPhoto: (url) => set({ characterPhoto: url }),
  setMyPhoto: (url) => set({ myPhoto: url }),
  setMode: (mode) => set({ mode }),
  setConcept: (conceptId) => set({ conceptId }),
  setFreeText: (freeText) => set({ freeText }),
  setResult: (resultImage, resultMeta) => set({ resultImage, resultMeta }),
  resetBooth: () =>
    set({
      characterId: null,
      characterPhoto: null,
      myPhoto: null,
      mode: "concept",
      conceptId: null,
      freeText: "",
    }),
}));
