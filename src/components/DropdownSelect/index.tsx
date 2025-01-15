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
import { FormControl, SxProps } from "@mui/material";
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
    padding: "auto 32px auto 20px",
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
  "& .MuiInputBase-root": {
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
  const { setFieldValue, handleBlur, touched, errors } = useFormikContext<FormValues>();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    const selectedOption = options.find((option) => option.label === value) || null;
    setSelectedItem(selectedOption);
    setFieldValue(name, value);
  };

  return (
    <FormControl
      sx={{
        ...(baseStyles as SxProps<Theme>),
        ...(customStyles as SxProps<Theme>),
        minWidth: 155
      }}
      variant="filled"
    >
      <Select
        value={selectedItem ? selectedItem.label : ""}
        onChange={handleChange}
        onBlur={handleBlur}
        displayEmpty
        inputProps={{
          "aria-labelledby": name,
        }}
        renderValue={(value) => {
          if (selectedItem) {
            return (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InputAdornment position="start">
                  <Image
                    src={getIconPath(selectedItem.label)}
                    alt={selectedItem.label}
                    width={24}
                    height={24}
                  />
                </InputAdornment>
                {selectedItem.label}
              </Box>
            );
          }
          return label || "";
        }}
        error={touched[name] && Boolean(errors[name])}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.label}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                width={24}
                height={24}
                alt={option.label as string}
                src={option.icon as string}
              />
              <Box sx={{ ml: 1 }}>{option.label}</Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}