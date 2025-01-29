"use client";

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import { useAppSelector } from "@/store";
import Button from "@/components/Button";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import { useMemo, useState } from "react";
import { ApiError } from "@/types/error";
import {FormHelperText, InputAdornment, SxProps, Theme} from "@mui/material";
import * as React from "react";
import ModalComponent from "@/components/Modal";
import {getCurrenciesOptions, getStakingIncome} from "@/services/exchange";
import classNames from "classnames";
import {createValidationSchema} from "@/containers/Staking/validation";
import DropdownSelect from "@/components/DropdownSelect";
import {Option} from "@/types/option";
import {useCreateStakingMutation} from "@/api/staking";
import Image from "next/image";
import {CurrencyRuble} from "@mui/icons-material";

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