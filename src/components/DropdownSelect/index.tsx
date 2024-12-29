"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import { Option } from "@/types/option";
import { useFormikContext } from "formik";
import Input from "../Input";
import styles from "./index.module.scss";
import { getIconPath, isFiat } from "@/services/exchange";
import { SxProps } from "@mui/material";
import { Theme } from "@emotion/react";

interface DropdownSelectProps {
  label?: string;
  name: string;
  setSelectedItem: (value: Option | null) => void;
  selectedItem: Option | null;
  options: Option[];
  text?: string;
  touched?: Record<string, boolean>;
  errors?: Record<string, string>;
}

interface FormValues {
  [key: string]: string;
}


// const baseStyles: SxProps<Theme> = {
//   "& .MuiFilledInput-root": {
//     color: "#000",
//     backgroundColor: "#fff !important",
//     boxShadow: "-1px 0 5px rgba(0, 0, 0, 0.1)",
//     borderRadius: "3px",
//     height: "100%",
//     "&:before": {
//       display: "none",
//     },
//     "&:after": {
//       display: "none",
//     },
//     ":hover:not(.Mui-focused)": {
//       "&:before": {
//         border: "none",
//       },
//       backgroundColor: "#fff",
//     },
//   },
//   "& .MuiInputLabel-filled": {
//     color: "#A3A3A3",
//     fontWeight: "bold",
//     "&.Mui-focused": {
//       color: "#A3A3A3",
//     },
//     "&.Mui-disabled": {
//       color: "#75777F",
//     },
//   },
//   "& .MuiInputLabel-root": {
//     paddingLeft: "5px",
//   },
//   "& .MuiInputLabel-shrink": {
//     position: "absolute",
//     right: "0",
//     left: "0",
//     top: "-2px",
//     maxWidth: "100%",
//   },
//   "& .MuiInputBase-root": {
//     padding: '10px',
//     height: "100%",
//   },
//   "& .MuiInputAdornment-root": {
//     margin: '0 !important',
//   },
// };

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
    "@media (min-width: 800px)": {
      borderRadius: "5px",
    },
    "@media (min-width: 1100px)": {
      boxShadow: "-1px 0 10px rgba(0, 0, 0, 0.1)",
    },
  },
  "& .MuiInputLabel-filled": {
    color: "#A3A3A3",
    fontWeight: "bold",
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
    padding: "20px",
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
  "& .MuiInputLabel-root": {
    right: 0,
    top: "5px",
    paddingLeft: "10px",
    "@media (min-width: 800px)": {
      top: "7px",
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
  "& .MuiInputAdornment-root": {
    marginTop: "0 !important",
    marginRight: "6px",
  },
  "& .MuiInputBase-root": {
    padding: "10px 10px 10px 20px !important",
    height: "100%",
  },
};


export default function DropdownSelect({
  name,
  setSelectedItem,
  selectedItem,
  options,
  label,
  customStyles,
}: DropdownSelectProps) {

  const {setFieldValue, handleBlur, touched, errors} = useFormikContext<FormValues>();

	const handleChange = (event: React.SyntheticEvent<Element, Event>, value: Option | null) => {
		if(value) {
			setSelectedItem(value);
			setFieldValue(name, value.label);
		} else {
			setSelectedItem(null);
			setFieldValue(name, '');
		}
	}

  return (
    <Box sx={{
      ...(customStyles as SxProps<Theme>),
      minWidth: 190,
    }}>
      <Autocomplete
        options={options}
        value={selectedItem}
        id={name}
        onChange={handleChange}
        getOptionLabel={(option) => option.label || ""}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest} style={{ borderBottom: '1px solid #ccc', padding: '8px 16px' }}>
              <Image
                className={styles.icon}
                width={24}
                height={24}
                alt={option.label as string}
                src={option.icon as string}
              />
              {option.label}
            </li>
          )
        }}
        renderInput={(params) => (
          <Input
            {...params}
            placeholder={label || ""}
            InputProps={{
              ...params.InputProps,
              startAdornment: selectedItem ? (
                <InputAdornment position="start">
                  <Image
                    src={getIconPath(selectedItem.label)}
                    alt={selectedItem.label}
                    width={24}
                    height={24}
                  />
                </InputAdornment>
              ) : null,
            }}
            sx={{
              ...(baseStyles as SxProps<Theme>),
            }}
            required
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
          />
        )}
      />
    </Box>
  );
}
