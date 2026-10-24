"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type GlobalLoadingContextValue = {
  runWithGlobalLoading: <T>(task: () => Promise<T>) => Promise<T>;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(
  null,
);

export function GlobalLoadingScreen() {
  return (
    <div className="global-loading" role="status" aria-live="polite">
      <span className="global-loading__spinner" aria-hidden="true" />
      <span>Đang tải dữ liệu...</span>
    </div>
  );
}

export function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeRequests, setActiveRequests] = useState(0);

  const runWithGlobalLoading = useCallback(
    async <T,>(task: () => Promise<T>) => {
      setActiveRequests((count) => count + 1);

      try {
        return await task();
      } finally {
        setActiveRequests((count) => Math.max(0, count - 1));
      }
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ runWithGlobalLoading }),
    [runWithGlobalLoading],
  );

  return (
    <GlobalLoadingContext.Provider value={contextValue}>
      {children}
      {activeRequests > 0 ? <GlobalLoadingScreen /> : null}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);

  if (!context) {
    throw new Error(
      "useGlobalLoading must be used inside GlobalLoadingProvider.",
    );
  }

  return context;
}
