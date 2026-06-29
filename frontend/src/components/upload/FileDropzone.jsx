import { motion } from "framer-motion";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

function getExtension(filename) {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

export default function FileDropzone({ file, onFileSelect, error, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndSet = useCallback(
    (selected) => {
      if (!selected) return;

      const ext = getExtension(selected.name);
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        onError("Unsupported file format. Please upload a PDF or DOCX file.");
        return;
      }
      if (selected.size === 0) {
        onError("The selected file is empty.");
        return;
      }
      if (selected.size > MAX_SIZE_BYTES) {
        onError("File is too large. Maximum allowed size is 5 MB.");
        return;
      }

      onError(null);
      onFileSelect(selected);
    },
    [onFileSelect, onError]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    validateAndSet(dropped);
  };

  return (
    <div>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragging
            ? "border-brand-purple bg-brand-purple/10"
            : "border-surface-border bg-surface-card/40 hover:border-brand-purple/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <div className="text-left">
              <p className="text-white font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" /> {file.name}
              </p>
              <p className="text-gray-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
                onError(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="ml-3 text-gray-400 hover:text-white"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <p className="text-white font-medium">Drag and drop your resume here</p>
            <p className="text-gray-500 text-sm mt-1">or click to browse — PDF or DOCX, up to 5 MB</p>
          </>
        )}
      </motion.div>

      {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}
