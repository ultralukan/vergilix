import React, { useState, DragEvent, useEffect } from "react";
import styles from "./index.module.scss";
import { useTranslations } from "next-intl";

interface UploadFormProps {
  value: File | null;
  setValue: (file: File | null) => void;
  errors: boolean;
  label: string;
}

export default function UploadFormSupport({ value, setValue, errors, label }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("FormVerification");

  const validateFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return t("formFileFormat");
    }

    if (file.size > maxSize) {
      return t("formFileSize");
    }

    return null;
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setValue(null);
    } else {
      setError(null);
      setValue(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file || null);
  };

  const handleClear = () => {
    setValue(null);
    setError(null);
  };

  return (
    <div
      className={`${styles.uploadContainer} ${
        isDragging ? styles.dragging : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !value && document.getElementById("fileInput")?.click()}
    >
      {value ? (
        <div className={styles.fileInfo}>
          <span>{value.name}</span>
          <button onClick={handleClear} className={styles.clearButton}>
            {t("formClearFile")}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.label}>{label}</div>
          <img src={"./upload.png"} className={styles.uploadIcon} />
          <div className={styles.uploadText}>
            <p>{t("formFileFormat")}</p>
            <p>{t("formFileSize")}</p>
          </div>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
            capture="user"
          />
        </>
      )}
      {(error || errors) && (
        <div className={styles.errorMessage}>
          {error}
          {error && errors && <br />}
          {errors}
        </div>
      )}
    </div>
  );
}
