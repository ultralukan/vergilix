import { TextField, SxProps, Theme, TextFieldProps } from "@mui/material";
import { useFormikContext } from "formik";
import styles from "./index.module.scss";

type PropsType = {
  value: string;
  setValue: (value: string) => void;
  label?: string;
  name: string;
  type: string;
  customStyles?: SxProps<Theme>;
  InputProps?: TextFieldProps["InputProps"];
  disabled?: boolean;
};

const baseStyles: SxProps<Theme> = {
  "& .MuiFilledInput-root": {
    color: "#000",
    backgroundColor: "#fff !important",
    boxShadow: "-1px 0 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "3px",
    "&:before": {
      display: "none",
    },
    "&:after": {
      display: "none",
    },
    ":hover:not(.Mui-focused)": {
      "&:before": {
        border: "none",
      },
      backgroundColor: "#fff",
    },
  },
  "& .MuiInputLabel-filled": {
    fontWeight: "bold",
    fontSize: "22px",
    color: "#A3A3A3",
    "&.Mui-focused": {
      color: "#A3A3A3",
    },
    "&.Mui-disabled": {
      color: "#75777F",
    },
  },
  "& .MuiInputBase-input": {
    height: "36px",
    paddingLeft: "20px",
    borderRadius: "3px",
    fontWeight: "bold",
    fontSize: "22px",
  },
  "& .MuiInputBase-inputMultiline": {
    height: "36px",
    paddingLeft: "10px",
    borderRadius: "3px",
    fontWeight: "bold",
    fontSize: "22px",
    paddingTop: "5px"
  },
  "& .MuiInputLabel-root": {
    right: 0,
    top: "3px",
    paddingLeft: "10px",
  },
  "& .MuiInputLabel-shrink": {
    position: "absolute",
    right: "0",
    left: "0",
    top: "-3px",
    maxWidth: "100%"
  },
};

export default function Input({
  value,
  setValue,
  label,
  name,
  type,
  customStyles,
  ...props
}: PropsType) {
  const { touched, errors, handleBlur } = useFormikContext<{ [key: string]: string }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <TextField
      id={name}
      value={value}
      onChange={handleChange}
      label={label}
      type={type}
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
      onBlur={handleBlur}
      className={styles.input}
      variant="filled"
      fullWidth
      sx={{
        ...(baseStyles as SxProps<Theme>),
        ...(customStyles as SxProps<Theme>),
      }}
      {...props}
    />
  );
}
