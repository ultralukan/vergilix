"use client"

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import Input from "@/components/Input";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import { Form, Formik } from "formik";
import DropdownSelect from "@/components/DropdownSelect";
import { useGetRateQuery } from "@/api/rates";
import { getIconPath, groupRatesByTypeAndCurrency } from "@/services/exchange";
import { Option } from "@/types/option";
import classNames from "classnames";
import SwapIcon from '../../public/swap.svg';
import { useRouter, useSearchParams } from "next/navigation";
import { createValidationSchema } from "./validation";
import { useAppSelector } from "@/store";

function shouldFixed(value: string) {
  const num = Number(value);
  if (Number.isInteger(num)) {
    return value;
  }

  const floatValue = parseFloat(value);
  const decimalPlaces = (value.split('.')[1] || '').length;
  return floatValue.toFixed(Math.min(5, decimalPlaces));
}


function Home() {
  const { data: rates = [], isFetching } = useGetRateQuery();
  const groupedRates = useMemo(() => groupRatesByTypeAndCurrency(rates), [rates]);
  const t = useTranslations('Main');
  const e = useTranslations('Validation');
  const [selectedItemFrom, setSelectedItemFrom] = useState<Option | null>(null);
  const [selectedItemTo, setSelectedItemTo] = useState<Option | null>(null);
  const [amountFrom, setAmountFrom] = useState<string>("");
  const [amountTo, setAmountTo] = useState<string>("");
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editingField, setEditingField] = useState<"amountFrom" | "amountTo" | null>(null);
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || "BTC";
  const to = searchParams.get('to') || "RUB";
  const [rate, setRate] = useState<number>(1);
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuth = !!token && user;

  const optionsFrom = useMemo(() => {
    const rates = groupedRates.FROM;
    if (selectedItemTo) {
      const valueTo = selectedItemTo?.label as string;
      return Object.keys(groupRatesByTypeAndCurrency(groupedRates.TO[valueTo]).FROM).map((el, index) => ({value: index, label: el, icon: getIconPath(el)})) || [];
    }
    return Object.keys(rates).map((el, index) => ({value: index, label: el, icon: getIconPath(el)})) || [];
  }, [groupedRates, selectedItemTo])

  const optionsTo = useMemo(() => {
    const rates = groupedRates.TO;
    if (selectedItemFrom) {
      const valueFrom = selectedItemFrom?.label as string;
      return Object.keys(groupRatesByTypeAndCurrency(groupedRates.FROM[valueFrom]).TO).map((el, index) => ({value: index, label: el, icon: getIconPath(el)})) || [];
    }
    return Object.keys(rates).map((el, index) => ({value: index, label: el, icon: getIconPath(el)})) || [];
  }, [groupedRates, selectedItemFrom])

  useEffect(() => {
    if(rates.length && optionsFrom.length) {
      try {
        if(!selectedItemFrom && !selectedItemTo) {
          setSelectedItemFrom(optionsFrom.filter((el) => el.label === from)[0])
          setSelectedItemTo(optionsTo.filter((el) => el.label === to)[0])
        }
      }catch{}
    }
  }, [rates, selectedItemFrom, selectedItemTo, optionsFrom, optionsTo, from, to])

  const selectedRate = useMemo(() => {
    if (!selectedItemTo?.label || !selectedItemFrom?.label || !rates.length) return null;
    return rates.find(
      (el) => el.fromCurrency === selectedItemFrom?.label && el.toCurrency === selectedItemTo?.label
    );
  }, [selectedItemFrom?.label, selectedItemTo?.label, rates]);

  const debounceUpdate = (callback: () => void, delay: number): void => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(callback, delay);
  };

  useEffect(() => {
    if (selectedRate) {
      setRate(selectedRate.adjustedRate);

      if (editingField === "amountFrom" && amountFrom) {
        debounceUpdate(() => {
          const updatedAmountTo = String(parseFloat(amountFrom) * selectedRate.adjustedRate);
          setAmountTo(updatedAmountTo);
        }, 300);
      }

      if (editingField === "amountTo" && amountTo) {
        debounceUpdate(() => {
          const updatedAmountFrom = String(parseFloat(amountTo) / selectedRate.adjustedRate);
          setAmountFrom(updatedAmountFrom);
        }, 300);
      }
    } else {
      setRate(1);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [selectedRate, amountFrom, amountTo, editingField]);

  const handleAmountFromChange = (value: string) => {
    setEditingField("amountFrom");
    setAmountFrom(value);
  };
  
  const handleAmountToChange = (value: string) => {
    setEditingField("amountTo");
    setAmountTo(value);
  };


  const tradeInfo = () => {
    if (
      !rates.length ||
      !selectedItemFrom?.label ||
      !selectedItemTo?.label
    ) {
      return null;
    }

    const valueFrom = rate < 1 ? 1 / rate : 1;
    const valueTo = rate > 1 ? rate : 1;
    const preparedFrom = shouldFixed(valueFrom.toString());
    const preparedTo = shouldFixed(valueTo.toString());

    return (
      <span className={styles.tradeInfo}>
        <b>{preparedFrom}</b> {selectedItemFrom?.label} = <b>{preparedTo}</b> {selectedItemTo?.label}
      </span>
    );
  };

  const isAvailableSwap = useMemo(() => {
    const filteredRates = rates
      .filter((el) => el.fromCurrency === selectedItemTo?.label)
      .filter((el) => el.toCurrency === selectedItemFrom?.label);
  
    return filteredRates.length > 0;
  }, [rates, selectedItemTo?.label, selectedItemFrom?.label]);

  const handleSwap = () => {
    if(isAvailableSwap) {
      const tempItem = selectedItemFrom;
      setSelectedItemFrom(selectedItemTo);
      setSelectedItemTo(tempItem);
    
      const tempAmount = amountFrom;
      setAmountFrom(amountTo);
      setAmountTo(tempAmount);
    }
  };


  const btnClass = classNames(
    styles.swap,
    { [styles["swap-disabled"]]: !isAvailableSwap }
  );

  const handleSubmit = (values) => {
    try{
      if(values && !!Object.keys(values).length) {
        sessionStorage.setItem('tradeInfo', JSON.stringify({...values, rate}))
        router.push('/trade')
      }
    }catch{}
  }

  const initialValues = useMemo(() => {
    return({
      amountFrom: amountFrom,
      amountTo: amountTo,
      selectedItemFrom: selectedItemFrom,
      selectedItemTo: selectedItemTo
    })
  }, [amountFrom, amountTo, selectedItemFrom, selectedItemTo])

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <div className={styles.overlay}>
            {t("title")
              .split(" ")
              .reduce<string[][]>((acc, word, index, array) => {
                if (index % 2 === 0) {
                  acc.push(array.slice(index, index + 2));
                }
                return acc;
              }, [])
              .map((pair, index) => (
                <div key={index}>
                  <span>{pair.join(" ")}</span>
                  <hr />
                </div>
              ))}
          </div>
        </div>
        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <div className={styles.rateInfo}>
            {
              !!tradeInfo() && (
                <>
                  <p className={styles.rateTitle}>{t("rateTitle")}</p>
                  <p className={styles.rateText}>{tradeInfo()}</p>
                </>
              )
            }
            </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize
          >
          {({ errors }) => {
            return(
            <Form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formItem}>
                  <Input
                    label={t('sell')}
                    name='amountFrom'
                    type="text"
                    value={amountFrom}
                    setValue={handleAmountFromChange}
                    customStyles={{width: '63%'}}
                    type="number"
                    required
                  />
                  <DropdownSelect
                    id="selectedItemFrom"
                    name="selectedItemFrom"
                    setSelectedItem={setSelectedItemFrom}
                    selectedItem={selectedItemFrom}
                    options={optionsFrom as Option[]}
                    customStyles={{width: '37%'}}
                    label={t('currencyDrop')}
                  />
                </div>
                <div>
                  <div className={styles.swap}>
                    <button type="button" className={btnClass} onClick={() => isAvailableSwap && handleSwap()}>
                      <div className={styles.iconWrapper}>
                        <SwapIcon className={styles.icon}/>
                      </div>
                      {/* <img className={styles.icon} src="./swap.png"/> */}
                    </button>
                 </div>
                </div>
                <div className={styles.formItem}>
                  <Input
                    label={t('buy')}
                    name='amountTo'
                    type="text"
                    value={amountTo}
                    setValue={handleAmountToChange}
                    customStyles={{width: '63%'}}
                    type="number"
                    required
                  />
                  <DropdownSelect
                    label={t('currencyDrop')}
                    id="selectedItemTo"
                    name="selectedItemTo"
                    setSelectedItem={setSelectedItemTo}
                    selectedItem={selectedItemTo}
                    options={optionsTo as Option[]}
                    customStyles={{width: '37%'}}
                  />
                </div>
              </div>
              <div className={styles.button}>
                <Button disabled={!!isFetching || !isAuth} label={!isAuth ? t('exchangeBtnDisabled') :t('exchangeBtn')} type="submit" showArrow={false}/>
              </div>
              <p className={styles.termsText}>{t("terms")}</p>
            </Form>
            )}}

            </Formik>
          </div>
        </div>
      </div>
      <img className={styles.bgImage} src="./bg.png"/>
      <span className={styles.bgColor}></span>
    </div>
  );
}

const HomeWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
};

export default HomeWrapper;
