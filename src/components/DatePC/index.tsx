import { TextField, SxProps, Theme, TextFieldProps } from "@mui/material";
import { useFormikContext } from "formik";
import styles from "./index.module.scss";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type PropsType = {
  value: string;
  setValue: (value: string) => void;
  label?: string;
  name: string;
  customStyles?: SxProps<Theme>;
  InputProps?: TextFieldProps["InputProps"];
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
    color: "#A3A3A3",
    fontWeight: "bold",
    "&.Mui-focused": {
      color: "#A3A3A3",
    },
  },
  "& .MuiButtonBase-root": {
    right: 10
  },
  "& .MuiInputBase-input": {
    height: "32px",
    paddingLeft: "20px",
    borderRadius: "3px",
  },
  "& .MuiInputLabel-root": {
    right: 0,
    top: "5px",
    paddingLeft: "10px",
  },
  "& .MuiInputLabel-shrink": {
    position: "absolute",
    right: "0",
    left: "0",
    top: "-3px",
    maxWidth: "100%"
  },
  "& .MuiSvgIcon-root": {
    color: "#6BE8C2",
    "&:hover": {
      color: "#6BE8C2",
    },
  },
};

export default function DatePC({
  value,
  setValue,
  label,
  name,
  customStyles,
  ...props
}: PropsType) {
  const { touched, errors, handleBlur } = useFormikContext<{ [key: string]: string }>();

  const handleChange = (newValue: any) => {
    setValue(newValue);
  };

  const parsedValue = value ? dayjs(value) : null;
  const isValidDate = parsedValue && parsedValue.isValid();

  return (
    <DatePicker
      value={isValidDate ? parsedValue : null} в
      onChange={handleChange}
      label={label}
      slots={{
        textField: (textFieldProps) => (
          <TextField
            {...textFieldProps}
            name={name}
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
        ),
      }}
    />
  );
}
