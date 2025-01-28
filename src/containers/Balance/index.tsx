"use client";

import { useTranslations } from "next-intl";
import BalanceIcon from "../../../public/balance.svg";
import styles from "./index.module.scss";
import { useAppSelector } from "@/store";
import Button from "@/components/Button";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import { useEffect, useMemo, useState } from "react";
import { ApiError } from "@/types/error";
import { usePostWithdrawalMutation } from "@/api/withdrawal";
import { createValidationSchema } from "@/containers/Balance/validation";
import {Autocomplete, Box, FormControl, SxProps, Theme} from "@mui/material";
import Image from "next/image";
import * as React from "react";
import ModalComponent from "@/components/Modal";
import {MuiTelInput} from "mui-tel-input";

const baseStyles: SxProps<Theme> = {
  "& .MuiFilledInput-root": {
    color: "#000",
    backgroundColor: "#fff !important",
    borderRadius: "3px",
    paddingRight: 5,
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
    fontSize: "20px",
    color: "#A3A3A3",
    lineHeight: "34px",
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
    paddingLeft: "11px !important",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "20px",
    letterSpacing: "-0.5px",
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
    paddingLeft: "20px",
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
    letterSpacing: "-0.5px",
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
    top: "2px",
    maxWidth: "100%",
    textTransform: "uppercase",
    fontSize: "16px",
    letterSpacing: "normal",
    fontWeight: "bold",
    "@media (min-width: 800px)": {
      top: "-1px",
      fontSize: "18px",
    },
  },
};

const bankOptions = [
  { value: "sberbank", label: "Сбербанк" },
  { value: "tinkoff", label: "Т-Банк" },
  { value: "alfa", label: "Альфа-Банк" },
  { value: "vtb", label: "ВТБ" },
  { value: "ozon", label: "Озон Банк" },
  { value: "pochta", label: "Почта Банк" },
  { value: "raif", label: "Райффайзен Банк" },
];


export default function Balance() {
  const user = useAppSelector((state) => state.auth.user);
  const t = useTranslations("Balance");
  const e = useTranslations("Validation");
  const a = useTranslations("API")
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const balance = user?.balance;
  const [modal, setModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [withdrawal] = usePostWithdrawalMutation();

  useEffect(() => {
    try {
      if (user && Object.keys(user) && Object.keys(user).length) {
        if (user?.phoneNumber) setPhoneNumber(user.phoneNumber);
      }
    } catch {}
  }, [user]);

  const initialValues = useMemo(() => {
    return {
      phone: phoneNumber,
      amount: amount,
      bank: bank,
    };
  }, [phoneNumber, amount, bank]);

  const handleOpen = () => setModal(true);
  const handleClose = () => {
    setModal(false);
    setModalText("");
    setModalTitle("");
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      const response = await withdrawal({ bank: bankOptions.filter((el) => el.value === bank)[0].label, amount, phoneNumber }).unwrap();

      if (response) {
        resetForm();
        setSuccessMessage(t("successMessage"));
        setAmount("");
        setBank("");
      }
    } catch (error) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;

        if (status === 400) {
          setModalText(a(`withdrawal400`));
          setModalTitle(t("errorValidation"))
        } else {
          setModalTitle(t("error"))
        }
      }
      handleOpen()
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = useMemo(
    () => createValidationSchema(e, balance),
    [e, balance]
  );
  const [value, setValue] = React.useState('')

  const handleChange = (newValue) => {
    setValue(newValue)
  }
  return (
    <>
      {successMessage ? (
        <h5 className={styles.successMessage}>{t("successMessage")}</h5>
      ) : null}
      <div className={styles.main}>
        <div className={styles.item}>
          <h5 className={styles.title}>{t("title")}</h5>
          <div className={styles.card}>
            <BalanceIcon className={styles.icon} />
            <div className={styles.text}>
              <p className={styles.textLabel}>{t("title")}:</p>
              <p className={styles.textBalance}>{user?.balance} &#8381;</p>
            </div>
          </div>
          <div className={styles.button}>
            <Button
              label={t("btnLabel")}
              type={"link"}
              onClick={() =>
                window.open("https://vergilix.exchange/page2", "_blank")
              }
            />
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
          enableReinitialize
        >
          {({}) => {
            return (
              <Form className={styles.form}>
                <h5 className={styles.header}>{t("titleWith")}</h5>
                <div className={styles.formItems}>
                  <div className={styles.formItem}>
                    <Input
                      label={t("amount")}
                      name="amount"
                      type="number"
                      value={amount}
                      setValue={setAmount}
                      required
                    />
                  </div>
                  <div className={styles.formItem}>
                    <Box sx={baseStyles}>
                      <Autocomplete
                        id={"bank"}
                        options={bankOptions}
                        getOptionLabel={(option) => option.label}
                        value={bankOptions.find((option) => option.value === bank) || null}
                        onChange={(_, newValue) => {
                          setBank(newValue ? newValue.value : "");
                        }}
                        popupIcon={<Image src={"/dropdown.svg"} width={15} height={15} alt="more"/>}
                        renderInput={(params) => (
                          <Input
                            {...params}
                            label={t("bank")}
                            name="bank"
                            type="text"
                            required
                          />
                        )}
                      />
                    </Box>
                  </div>
                  <div className={styles.formItem}>
                    <Input
                      label={t("phone")}
                      name="phone"
                      type="phone"
                      value={phoneNumber}
                      setValue={setPhoneNumber}
                      disabled
                    />
                  </div>
                  <p className={styles.helperText}>{t("helperText")}</p>
                </div>
                <div className={styles.button}>
                  <Button
                    label={t("buttonWith")}
                    type={"submit"}
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <ModalComponent
        open={modal}
        onClose={handleClose}
        title={modalTitle}
        btnText={t("btnError")}
        status={false}
        content={modalText}
      />
    </>
  );
}