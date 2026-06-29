import { createContext, useContext, useMemo, useState } from "react";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const value = useMemo(
    () => ({
      resumeFile,
      setResumeFile,
      jobDescription,
      setJobDescription,
      result,
      setResult,
      reset: () => {
        setResumeFile(null);
        setJobDescription("");
        setResult(null);
      },
    }),
    [resumeFile, jobDescription, result]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysisContext() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysisContext must be used within an AnalysisProvider");
  }
  return ctx;
}
