"use client"

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import Input from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import { Form, Formik } from "formik";
import BasicSelect from "@/components/DropdownItem";
import DropdownSelect from "@/components/DropdownSelect";
import { useGetRateQuery } from "@/api/rates";
import { getIconPath, groupRatesByTypeAndCurrency, isFiat } from "@/services/exchange";
import { Option } from "@/types/option";
import classNames from "classnames";
import SwapVertIcon from '@mui/icons-material/SwapVert';

function shouldFixed(value: string) {
  const num = Number(value);
  if (Number.isInteger(num)) {
    return value;
  }

  const floatValue = parseFloat(value);
  
  const decimalPlaces = (value.split('.')[1] || '').length;
  
  return floatValue.toFixed(Math.min(5, decimalPlaces));
}


export default function Home() {
  const { data: rates = [] } = useGetRateQuery();
  const groupedRates = useMemo(() => groupRatesByTypeAndCurrency(rates), [rates]);
  const t = useTranslations('Main');
  const [selectedItemFrom, setSelectedItemFrom] = useState<Option | null>(null);
  const [selectedItemTo, setSelectedItemTo] = useState<Option | null>(null);
  const [amountFrom, setAmountFrom] = useState<string>("");
  const [amountTo, setAmountTo] = useState<string>("");
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editingField, setEditingField] = useState<"amountFrom" | "amountTo" | null>(null);
  // const [selectedOptionFrom, setSelectedOptionFrom] = useState<string>('coin');
  // const [selectedOptionTo, setSelectedOptionTo] = useState<string>('cash');
  const [rate, setRate] = useState<number>(1);

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

  const handleSubmit = () => {}

  const initialValues = useMemo(() => {
    return({
      name: '',
      email: '',
      question: '',
    })
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <div className={styles.overlay}>
            {t("title")
              .split(" ")
              .reduce<string[][]>((acc, word, index, array) => {
                if (index % 2 === 0) {
                  acc.push(array.slice(index, index + 2)); // Берем по 2 слова
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
          <div>
          <div className={styles.rateInfo}>
            <p className={styles.rateTitle}>{t("rateTitle")}</p>
            <p className={styles.rateText}>{tradeInfo()}</p>
          </div>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize
          >
            <Form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formItem}>
                  <Input
                    label={t('sell')}
                    name='name'
                    type="text"
                    value={amountFrom}
                    setValue={handleAmountFromChange}
                  />
                  <DropdownSelect
                    id="selectedItemFrom"
                    name="selectedItemFrom"
                    setSelectedItem={setSelectedItemFrom}
                    selectedItem={selectedItemFrom}
                    options={optionsFrom as Option[]}
                  />
                </div>
                <div>
                  <div className={styles.swap}>
                    <button type="button" className={btnClass} onClick={() => isAvailableSwap && handleSwap()}>
                      <SwapVertIcon className={styles.icon}/>
                    </button>
                 </div>
                </div>
                <div className={styles.formItem}>
                  <Input
                    label={t('buy')}
                    name='name'
                    type="text"
                    value={amountTo}
                    setValue={handleAmountToChange}
                  />
                  <DropdownSelect
                    id="selectedItemTo"
                    name="selectedItemTo"
                    setSelectedItem={setSelectedItemTo}
                    selectedItem={selectedItemTo}
                    options={optionsTo as Option[]}
                  />
                </div>
              </div>
              <div className={styles.button}>
                <Button label={t('exchangeBtn')} onClick={() => {}} showArrow={false}/>
              </div>
            </Form>
          </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
