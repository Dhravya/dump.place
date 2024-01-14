"client-only";
import { create } from "zustand";

interface Dump {
  content: string;
  isPrivate: boolean;
}

interface DumpState {
  dumpStatus: "notStarted" | "inProgress" | "completed" | "failed";
  dumpData: Dump | null;
  updateDump: (data: Dump) => void;
  removeDump: () => void;
  completeDump: () => void;
}

const useDumpStore = create<DumpState>((set) => ({
  dumpStatus: "notStarted",
  dumpData: null,

  updateDump: (data: Dump) => {
    set({
      dumpStatus: "inProgress",
      dumpData: data,
    });
  },

  removeDump: () => {
    set({
      dumpStatus: "failed",
      dumpData: null,
    });
  },

  completeDump: () => {
    set({
      dumpStatus: "completed",
      dumpData: null,
    });
  },
}));

export default useDumpStore;
