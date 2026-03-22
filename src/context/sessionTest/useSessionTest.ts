import { useContext } from "react";
import {
  SessionTestContext,
  SessionTestContextType,
} from "./sessionTest.context";

export const useSessionTest = (): SessionTestContextType => {
  const context = useContext(SessionTestContext);

  if (!context) {
    throw new Error(
      "useSessionTest must be used within SessionTestProvider"
    );
  }

  return context;
};