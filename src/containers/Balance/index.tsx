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
import {
  createValidationCardSchema,
  createValidationSBPSchema,
} from "@/containers/Balance/validation";
import {Autocomplete, Box, InputAdornment, SxProps, Theme} from "@mui/material";
import Image from "next/image";
import * as React from "react";
import ModalComponent from "@/components/Modal";
import classNames from "classnames";
import {useGetWalletsQuery, walletsApi} from "@/api/wallets";
import DropdownSelect from "@/components/DropdownSelect";
import {Option} from "@/types/option";
import {getCurrenciesOptions, getWalletsOptions} from "@/services/exchange";

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

const customStyles: SxProps<Theme> = {
  "& .MuiInputBase-input, .MuiInputBase-multiline": {
    WebkitTextFillColor: 'black !important',
  },
}


export default function Balance() {
  const user = useAppSelector((state) => state.auth.user);
  const t = useTranslations("Balance");
  const e = useTranslations("Validation");
  const a = useTranslations("API")
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const balance = user?.balance;
  const [modal, setModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [withType, setWithType] = useState("sbp");
  const {data: wallets} = useGetWalletsQuery();

  const [withdrawal] = usePostWithdrawalMutation();
  const [currency, setCurrency] = useState(null);

  const options = useMemo(() => {
    return getWalletsOptions(wallets) || []
  }, [wallets]);

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
      cardNumber: cardNumber
    };
  }, [phoneNumber, amount, bank, cardNumber]);

  const handleOpen = () => setModal(true);
  const handleClose = () => {
    setModal(false);
    setModalText("");
    setModalTitle("");
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      let response;
      if(withType === "sbp") {
        response = await withdrawal({ bank: bankOptions.filter((el) => el.value === bank)[0].label, amount, phoneNumber }).unwrap();
      } else {
        response = await withdrawal({ amount, cardNumber }).unwrap();
      }

      if (response) {
        resetForm();
        setSuccessMessage(t("successMessage"));
        setAmount("");
        setBank("");
        setCardNumber("")
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
    () => withType === 'sbp' ? createValidationSBPSchema(e, balance) : createValidationCardSchema(e, balance),
    [e, balance, withType]
  );

  return (
    <>
      {successMessage ? (
        <h5 className={styles.successMessage}>{t("successMessage")}</h5>
      ) : null}
      <div className={styles.main}>
        <div className={styles.item}>
          <h5 className={styles.title}>{t("title")}</h5>
          <div className={styles.card}>
            <BalanceIcon className={styles.icon}/>
            <div className={styles.text}>
              <p className={styles.textLabel}>{t("title")}:</p>
              <p className={styles.textBalance}>{user?.balance} ₽</p>
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
          <div className={styles.crypto}>
            {t("cryptoTitle")}
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
              validateOnChange={true}
              validateOnBlur={true}
              enableReinitialize
            >
              <>
                <div className={styles.formItemCrypto}>
                  <DropdownSelect
                    id="currency"
                    name="currency"
                    setSelectedItem={setCurrency}
                    selectedItem={currency}
                    options={options as Option[]}
                    customStyles={{width: '100%'}}
                    label={t("currency")}
                  />
                </div>
                <div className={styles.formItem}>
                  {!!currency?.value && (
                    <Input
                      label={t("wallet")}
                      name="phone"
                      type="text"
                      value={currency?.value}
                      disabled
                      multiline={true}
                      customStyles={customStyles}
                    />
                  )}
                </div>
              </>
            </Formik>
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
          {({errors}) => {
            return (
              <Form className={styles.form}>
                <h5 className={styles.header}>{t("titleWith")}</h5>
                <div className={styles.formItems}>
                  <div className={styles.withItems}>
                    <div onClick={() => setWithType('sbp')}
                         className={classNames(styles.withItem, {[styles["withItem-selected"]]: withType === 'sbp'})}>{t("SBP")}
                    </div>
                    <div onClick={() => setWithType('card')}
                         className={classNames(styles.withItem, {[styles["withItem-selected"]]: withType === 'card'})}>{t("cardWith")}
                    </div>
                  </div>
                  <div className={styles.formItem}>
                    <Input
                      label={t("amount")}
                      name="amount"
                      type="number"
                      value={amount}
                      setValue={setAmount}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Image
                              width={30}
                              height={30}
                              src={'/new-icons/RUB.png'}
                              alt={"rubble"}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  {
                    withType === 'sbp' ? (
                      <>
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
                      </>
                    ) : (
                      <div className={styles.formItem}>
                        <Input
                          label={t("card")}
                          name="cardNumber"
                          type="card"
                          value={cardNumber}
                          setValue={setCardNumber}
                          required
                        />
                      </div>
                    )
                  }
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
          )
            ;
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