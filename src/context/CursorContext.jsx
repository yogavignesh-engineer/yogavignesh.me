import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState({
    mode: "default", // default, button, text, crosshair
    text: "",        // For "EXPLORE" or "VIEW"
  });

  // PERFORMANCE: useCallback to prevent this function from being recreated on every render.
  const setCursor = useCallback((mode, text = "") => {
    setCursorState({ mode, text });
  }, []);

  // PERFORMANCE: useMemo to ensure the context value object only changes when
  // cursorState changes. This prevents all consumers from re-rendering when the
  // provider itself re-renders for other reasons.
  const value = useMemo(() => ({ cursorState, setCursor }), [cursorState, setCursor]);

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);