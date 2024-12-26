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
import { getIconPath } from "@/services/exchange";

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
//     maxWidth: "100%"
//   },
//   "& .MuiInputBase-root": {
//     padding: '10px'
//   }
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
};

export default function DropdownSelect({
  name,
  setSelectedItem,
  selectedItem,
  options,
  text,
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
  console.log(options)

  return (
    <Box sx={{ minWidth: 150 }}>
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
            placeholder={text || ""}
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
            sx={baseStyles}
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
          />
        )}
      />
    </Box>
  );
}
