"use client";

import { Button as Btn, Box, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./index.module.scss";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  showBackArrow?: boolean;
  [key: string]: unknown;
  isLoading?: boolean;
}

export default function Button({
  label,
  onClick,
  showArrow = true,
  showBackArrow = false,
  isLoading,
  ...props
}: ButtonProps) {
  return (
    <Btn
      onClick={onClick}
      className={styles.button}
      sx={{
        "&.Mui-disabled": {
          opacity: 0.6,
          pointerEvents: "auto",
          backgroundColor: "gray",
          color: "white",
        },
        "&:hover": {
          filter: "brightness(0.9)",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        color: "black",
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: "3px",
        padding: "20px",
        "@media (min-width: 320px)": {
          fontSize: "18px",
        },
        "@media (min-width: 800px)": {
          fontSize: "16px",
        },
        "@media (min-width: 1100px)": {
          fontSize: "18px",
        },
        "@media (min-width: 1500px)": {
          fontSize: "20px",
        },
        "@media (min-width: 2000px)": {
          fontSize: "28px",
        },
        width: "100%",
        background: 'rgb(107, 232, 194)',
        boxShadow: "-1px 0 5px rgba(0, 0, 0, 0.1)",
        transition: "filter 0.3s ease",
      }}
      {...props}
    >
      <Box>{label}</Box>
        {isLoading ? (
          <CircularProgress sx={{
            position: "absolute",
            right: 20,
            color: 'inherit'
          }} size="30px" />
        ) : showArrow ?  (
          <ArrowForwardIcon
            sx={{
              position: "absolute",
              right: 20,
            }}
          />
        ) : null}
        {showBackArrow && (
        <ArrowBackIcon
          sx={{
            position: "absolute",
            left: 20,
          }}
        />
      )}
    </Btn>
  );
}
