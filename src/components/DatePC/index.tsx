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
    fontWeight: "bold",
    fontSize: "22px",
    color: "#A3A3A3",
    "&.Mui-focused": {
      color: "#A3A3A3",
    },
    "&.Mui-disabled": {
      color: "#75777F",
    },
    "@media (min-width: 800px)": {
      fontSize: "20px",
    },
    "@media (min-width: 1100px)": {
      fontSize: "22px",
    },
    "@media (min-width: 1500px)": {
      fontSize: "24px",
    },
    "@media (min-width: 2000px)": {
      fontSize: "26px",
    },
  },
  "& .MuiInputBase-input": {
    height: "36px",
    paddingLeft: "20px",
    borderRadius: "3px",
    fontWeight: "bold",
    fontSize: "22px",
    "@media (min-width: 800px)": {
      height: "32px",
      fontSize: "20px",
    },
    "@media (min-width: 1100px)": {
      height: "30px",
      fontSize: "22px",
    },
    "@media (min-width: 1500px)": {
      height: "36px",
      fontSize: "24px",
    },
    "@media (min-width: 2000px)": {
      height: "60px",
      fontSize: "28px",
    },
  },
  "& .MuiInputBase-inputMultiline": {
    height: "36px",
    paddingLeft: "10px",
    borderRadius: "3px",
    fontWeight: "bold",
    fontSize: "22px",
    paddingTop: "5px",
    "@media (min-width: 800px)": {
      height: "34px",
      fontSize: "20px",
    },
    "@media (min-width: 1100px)": {
      height: "32px",
      fontSize: "22px",
    },
    "@media (min-width: 1500px)": {
      height: "40px",
      fontSize: "24px",
    },
    "@media (min-width: 2000px)": {
      height: "60px",
      fontSize: "28px",
    },
  },
  "& .MuiInputLabel-root": {
    right: 0,
    top: "3px",
    paddingLeft: "10px",
    "@media (min-width: 800px)": {
      top: "7px",
    },
    "@media (min-width: 1100px)": {
      top: "3px",
    },
    "@media (min-width: 2000px)": {
      top: "12px",
    },
  },
  "& .MuiInputLabel-shrink": {
    position: "absolute",
    right: "0",
    left: "0",
    top: "-3px",
    maxWidth: "100%",
    "@media (min-width: 800px)": {
      top: "-1px",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#6BE8C2",
    "&:hover": {
      color: "#6BE8C2",
    },
  },
  "& .MuiButtonBase-root": {
    position: "relative",
    right: "15px",
  }
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
