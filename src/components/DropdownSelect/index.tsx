"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import { Option } from "@/types/option";
import { useFormikContext } from "formik";
import { getIconPath } from "@/services/exchange";
import {FormControl, FormHelperText, SxProps} from "@mui/material";
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
  customStyles: SxProps<Theme>;
}

interface FormValues {
  [key: string]: string;
}

const baseStyles: SxProps<Theme> = {
  "& .MuiFilledInput-root": {
    color: "#000",
    backgroundColor: "#fff !important",
    borderRadius: "3px",
    height: "69px",
    display: "flex",
    alignItems: "center",
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
    padding: "10px 32px 10px 20px",
    fontWeight: "bold",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
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
  "& .MuiInputAdornment-root": {
    marginTop: "0 !important",
    marginRight: "6px",
  },
};

const deepMergeStyles = (base: SxProps<Theme>, custom: SxProps<Theme>): SxProps<Theme> => {
  return {
    ...base,
    ...custom,
    "& .MuiFilledInput-root": {
      ...(base["& .MuiFilledInput-root"] as object),
      ...(custom["& .MuiFilledInput-root"] as object),
    },
  };
};

export default function DropdownSelect({
  name,
  setSelectedItem,
  selectedItem,
  options,
  label,
  customStyles,
}: DropdownSelectProps) {
  const { setFieldValue, handleBlur, touched, errors } = useFormikContext<FormValues>();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    const selectedOption = options.find((option) => option.label === value) || null;
    setSelectedItem(selectedOption);
    setFieldValue(name, value);
  };

  const mergedStyles = deepMergeStyles(baseStyles, customStyles || {});

  return (
    <FormControl
      sx={{
        ...mergedStyles,
        minWidth: 145
      }}
      variant="filled"
    >
      <Select
        value={selectedItem ? selectedItem.label : ""}
        onChange={handleChange}
        onBlur={handleBlur}
        displayEmpty
        required
        inputProps={{
          "aria-labelledby": name,
        }}
        sx={{
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            color: selectedItem ? "#000" : "#A3A3A3",
          },
          "& .MuiSelect-icon": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            top: "0",
            marginRight: "10px",
          },
        }}
        IconComponent={(props) => (<Image src={"/dropdown.svg"} width={15} height={15} alt="more" {...props}/>)}
        renderValue={() => {
          if (selectedItem) {
            return (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InputAdornment position="start">
                  <Image
                    src={getIconPath(selectedItem.label)}
                    alt={selectedItem.label}
                    width={26}
                    height={26}
                  />
                </InputAdornment>
                <Box sx={{lineHeight: 1, pt: "5px"}}>
                  {selectedItem.label}
                </Box>
              </Box>
            );
          }
          return label || "";
        }}
        error={touched[name] && Boolean(errors[name])}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.label}>
            <Box sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
              <Image
                width={24}
                height={24}
                alt={option.label as string}
                src={option.icon as string}
              />
              <Box sx={{ ml: 1, lineHeight: 1, pt: "2px" }}>{option.label}</Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
      {touched[name] && errors[name] && (
        <FormHelperText error>{errors[name]}</FormHelperText>
      )}
    </FormControl>
  );
}