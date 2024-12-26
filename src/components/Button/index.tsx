"use client";

import { Button as Btn, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./index.module.scss";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  showBackArrow?: boolean;
  [key: string]: any;
}

export default function Button({
  label,
  onClick,
  showArrow = true,
  showBackArrow = false,
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
        width: "100%",
        background: 'rgb(107, 232, 194)',
        boxShadow: "-1px 0 5px rgba(0, 0, 0, 0.1)",
        transition: "filter 0.3s ease",
      }}
      {...props}
    >
      <Box>{label}</Box>
        {showArrow && (
          <ArrowForwardIcon
            sx={{
              position: "absolute",
              right: 20,
            }}
          />
        )}
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
