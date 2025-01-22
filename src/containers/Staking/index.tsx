"use client";

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import { useAppSelector } from "@/store";
import Button from "@/components/Button";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import { useMemo, useState } from "react";
import { ApiError } from "@/types/error";
import { usePostWithdrawalMutation } from "@/api/withdrawal";
import {Autocomplete, Box, FormHelperText, SxProps, Theme} from "@mui/material";
import Image from "next/image";
import * as React from "react";
import ModalComponent from "@/components/Modal";
import {getCurrenciesOptions, getStakingIncome} from "@/services/exchange";
import classNames from "classnames";
import {createValidationSchema} from "@/containers/Staking/validation";
import DropdownSelect from "@/components/DropdownSelect";
import {Option} from "@/types/option";
import {useCreateStakingMutation} from "@/api/staking";
import ArrowIcon from "../../../public/arrow.svg";

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


export default function Staking() {
  const user = useAppSelector((state) => state.auth.user);
  const rates = useAppSelector((state) => state.auth.rates);
  const options = useMemo(() => getCurrenciesOptions(rates), [rates]);
  const t = useTranslations("Staking");
  const e = useTranslations("Validation");
  const a = useTranslations("API")
  const [month, setMonth] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const balance = user?.balance;
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    btn: "",
    status: false,
    amounts: {
      amountFrom: "",
      amountTo: "",
      id: ""
    },
    onButtonClick: null
  });

  const [createStaking] = useCreateStakingMutation();

  const initialValues = useMemo(() => {
    return {
      currency: currency,
      amount: amount,
      month: month,
    };
  }, [currency, amount, month]);

  const handleOpen = () => setModal(true);
  const handleClose = () => {
    setModal(false);
  }

  const handleSubmitModal = async () => {
    try {
      setIsLoading(true);
      handleClose()
      const response = await createStaking({ currency: currency?.label, amountRub: Number(amount), duration: month }).unwrap();

      if (response) {
        setSuccessMessage(t("successMessage"));
        setAmount("");
        setCurrency(null);
        setMonth(null)
      }
    } catch (error) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;

        if ([400, 404, 500].includes(status)) {
          setErrorMessage(a(`staking${status}`));
        } else {
          setErrorMessage("An unexpected error occurred");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = useMemo(
    () => createValidationSchema(e, balance),
    [e, balance]
  );

  const income = useMemo(() => {
    if(!amount || !month || !currency) return;
    return getStakingIncome(amount, month)
  }, [amount, month, currency?.value])

  const handleSubmit = () => {
    setModalContent({
      title: t("modalTitle"),
      status: true,
      btn: t("btnText"),
      onButtonClick: () => handleSubmitModal(),
      text: renderModalInputs(),
    });
    setModal(true);
  }

  const renderModalInputs = () => {
    return(
      <div className={styles.modalResult}>
        <div className={styles["modalResult-row"]}>
          <div>
            {t("currency")}: <span>{currency?.label}</span>
          </div>
          <div>
            {t("duration")}: <span>{month}</span>
          </div>
        </div>
        <div className={styles["modalResult-row"]}>
          <div>
            {t("amount")}: <span>{amount} ₽</span>
          </div>
          <div>
            {t("totalIncome")}: <span>{income?.totalIncome} ₽</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : successMessage ? <div className={styles.successMessage}>{successMessage}</div> : null}
      <div className={styles.main}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
          enableReinitialize
        >
          {({errors, touched}) => {
            return (
              <Form className={styles.form}>
                <h5 className={styles.header}>{t("title")}</h5>
                <div className={styles.formGroup}>
                  <div className={styles.formItems}>
                    <div className={styles.formItem}>
                      <div className={styles.stakingTitle}>{t("titleTime")}</div>
                      <div className={styles.stakingItems}>
                        <div onClick={() => setMonth(3)}
                             className={classNames(styles.stakingItem, {[styles["stakingItem-selected"]]: month === 3})}>3
                        </div>
                        <div onClick={() => setMonth(6)}
                             className={classNames(styles.stakingItem, {[styles["stakingItem-selected"]]: month === 6})}>6
                        </div>
                        <div onClick={() => setMonth(9)}
                             className={classNames(styles.stakingItem, {[styles["stakingItem-selected"]]: month === 9})}>9
                        </div>
                        <div onClick={() => setMonth(12)}
                             className={classNames(styles.stakingItem, {[styles["stakingItem-selected"]]: month === 12})}>12
                        </div>
                      </div>
                      {errors.month && touched.month && (
                        <FormHelperText error>{errors.month}</FormHelperText>
                      )}
                    </div>
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
                      <DropdownSelect
                        id="currency"
                        name="currency"
                        setSelectedItem={setCurrency}
                        selectedItem={currency}
                        options={options as Option[]}
                        customStyles={{width: '100%' }}
                        label={t('currency')}
                      />
                    </div>
                  </div>
                  {
                    income && (
                      <div className={styles.result}>
                        <div className={styles["result-header"]}><span
                          className={styles["result-header-label"]}>{t("totalIncome")}:</span><span>{income?.totalIncome} ₽</span>
                        </div>
                        <div className={styles["result-row"]}><span
                          className={styles["result-label"]}>{t("incomeTitle")}:</span><b>{income?.percentage} %</b>
                        </div>
                        <div className={styles["result-row"]}><span
                          className={styles["result-label"]}>{t("totalAmount")}:</span><b>{income?.totalAmount} ₽</b></div>
                      </div>
                    )
                  }
                </div>
                <div className={styles.button}>
                  <Button
                    label={t("btnText")}
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
        title={modalContent.title}
        content={modalContent.text}
        btnText={modalContent.btn}
        status={modalContent.status}
        onButtonClick={modalContent.onButtonClick}
      />
    </>
  );
}