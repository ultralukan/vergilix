import React, { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (value: string | null) => void;
}

type CaptchaRef = ReCAPTCHA | null;

export const Captcha = forwardRef<CaptchaRef, CaptchaProps>(({ onChange }, ref) => {
  const handleRecaptchaChange = (value: string | null) => {
    onChange(value);
  };
  
  return (
    <ReCAPTCHA
      ref={ref}
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      onChange={handleRecaptchaChange}
    />
  );
});

Captcha.displayName = "Captcha";
