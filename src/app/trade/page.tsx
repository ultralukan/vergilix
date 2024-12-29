"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Step, StepLabel, Stepper, SxProps } from "@mui/material";
import { Theme } from "@emotion/react";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Image from "next/image";
import Button from "@/components/Button";
import { createValidationSchemaStep1 } from "./validation";
import TimerIcon from "../../../public/timer.svg";

const baseStyles: SxProps<Theme> = {
  '& .MuiStepLabel-iconContainer .Mui-completed': {
    color: '#6BE8C2',
  },
  '& .MuiStepLabel-iconContainer .Mui-active': {
    color: '#6BE8C2',
  },
  '& .MuiStepLabel-label.Mui-active': {
    fontWeight: 'bold',
    color: '#000',
  },
  '& .MuiStepLabel-label': {
    color: '#A3A3A3',
  },
  '& .MuiStepConnector-line.Mui-active': {
    borderColor: '#6BE8C2',
  },
  '& .MuiStepConnector-line.Mui-completed': {
    borderColor: '#6BE8C2',
  },
};



function Trade() {
  const t = useTranslations('Trade');
  const e = useTranslations('Validation');
  const [activeStep, setActiveStep] = useState(0);
  const session = sessionStorage.getItem('tradeInfo') || null;
  const [values, setValues] = useState(null);
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if(session) {
      try {
        setValues(JSON.parse(session))
      } catch{}
    }
  }, [session])

  const steps = [1, 2];

  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const handleNext = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
  };

  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const initialValuesStep1 = useMemo(() => {
    return ({
      phone: phone,
      telegram: telegram,
      address: address
    })
  }, [phone, telegram, address])

  const validationSchemaStep1 = useMemo(() => createValidationSchemaStep1(e), [e])

  function step1() {
    return(
      <Formik
        initialValues={initialValuesStep1}
        validationSchema={validationSchemaStep1}
        onSubmit={handleSubmitStep1}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
      {() => (
        <Form className={styles.form}>
          <div className={styles.wrapper}>
            <div className={styles.details}>
              <div className={styles.amounts}>
                <div className={styles.amountRow}>
                  <div className={styles.image}>
                    <Image src={values?.selectedItemFrom?.icon} alt="iconCurrency" width={40} height={40}/>
                  </div>
                  <div className={styles.amountContainer}>
                    <div className={styles.amountTitle}>{t("send")}</div>
                    <div className={styles.amount}>{values?.amountFrom} {values?.selectedItemFrom.label}</div>
                  </div>
                </div>
                <div className={styles.amountRow}>
                  <div className={styles.image}>
                    <Image src={values?.selectedItemTo?.icon} alt="iconCurrency" width={40} height={40}/>
                  </div>
                  <div className={styles.amountContainer}>
                    <div className={styles.amountTitle}>{t("get")}</div>
                    <div className={styles.amount}>{values?.amountTo} {values?.selectedItemTo.label}</div>
                  </div>
                </div>
              </div>
              <div className={styles.currency}>
                <div className={styles.amount}>{tradeInfo(values?.rate, values?.selectedItemFrom.label, values?.selectedItemTo.label)}</div>
                <div className={styles.amountTitle}>{t("currencyTime")}</div>
              </div>
            </div>
            <div className={styles.inputs}>
              <div className={styles.inputsContainer}>
                <p className={styles.inputsTitle}>{t('sender')}</p>
                <Input
                  label={t('phone')}
                  name='phone'
                  type="text"
                  value={phone}
                  setValue={setPhone}
                  required
                />
                <Input
                  label={t('telegram')}
                  name='telegram'
                  type="text"
                  value={telegram}
                  setValue={setTelegram}
                  required
                />
              </div>
              <div className={styles.inputsContainer}>
                <p className={styles.inputsTitle}>{t('recipient')}</p>
                <Input
                  label={t('address')}
                  name='address'
                  type="text"
                  value={address}
                  setValue={setAddress}
                  required
                />
              </div>
              <div className={styles.button}>
                <Button label={t('btnStep1')} type="submit"/>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    )
  }

  function step2() {
    return(
    <div className={styles.final}>
      <div className={styles.currency}>
        <div className={styles.createdTitle}>{t("createdTradeTitle")}</div>
        <div className={styles.timerWrapper}>
          <div className={styles.timerTitle}>{t("timerTitle")}</div>
          <div className={styles.timer}>
            <div className={styles.timerIconWrapper}><TimerIcon  className={styles.timerIcon}/></div>
            <div className={styles.timerText}>{formattedTime}</div>
          </div>
        </div>
      </div>
      <div className={styles.amounts}>
        <div className={styles.amountRow}>
          <div className={styles.image}>
            <Image src={values?.selectedItemFrom?.icon} alt="iconCurrency" width={40} height={40}/>
          </div>
          <div className={styles.amountContainer}>
            <div className={styles.amountTitle}>{t("send")}</div>
            <div className={styles.amount}>{values?.amountFrom} {values?.selectedItemFrom.label}</div>
          </div>
        </div>
        <div className={styles.amountRow}>
          <div className={styles.image}>
            <Image src={values?.selectedItemTo?.icon} alt="iconCurrency" width={40} height={40}/>
          </div>
          <div className={styles.amountContainer}>
            <div className={styles.amountTitle}>{t("get")}</div>
            <div className={styles.amount}>{values?.amountTo} {values?.selectedItemTo.label}</div>
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <Button label={t('payButton')} type="submit"/>
      </div>
    </div>
    )
  }

  const handleSubmitStep1 = () => {
    handleNext();
  }


  return (
    <div className={styles.page}>
      <Stepper
        className={styles.stepper} 
        activeStep={activeStep} 
        sx={
          {
            '& .MuiStepConnector-line': {
            borderColor: '#DDD',
          }}}
        >
        {steps.map((label) => (
          <Step key={label} sx={baseStyles}>
            <StepLabel></StepLabel>
          </Step>
         ))}
      </Stepper>

      {
        values && (
          activeStep === 0 ? (
            <>
              <p className={styles.formTitle}>{t(`titleStep1`)}</p>
              {step1()}
            </>
          ) : activeStep === 1 ? (
            <>
              {step2()}
            </>
          ) : null
        )
      }         
    </div>
  );
}

const TradeWrapper = () => {
  return (
    <Suspense>
      <Trade />
    </Suspense>
  );
};

export default TradeWrapper;


const tradeInfo = (rate, labelFrom, labelTo) => {
  if (
    !rate ||
    !labelFrom ||
    !labelTo
  ) {
    return null;
  }

  const valueFrom = rate < 1 ? 1 / rate : 1;
  const valueTo = rate > 1 ? rate : 1;
  const preparedFrom = shouldFixed(valueFrom.toString());
  const preparedTo = shouldFixed(valueTo.toString());

  return (
    <span className={styles.tradeInfo}>
      <b>{preparedFrom}</b> {labelFrom} = <b>{preparedTo}</b> {labelTo}
    </span>
  );
};

function shouldFixed(value: string) {
  const num = Number(value);
  if (Number.isInteger(num)) {
    return value;
  }

  const floatValue = parseFloat(value);
  
  const decimalPlaces = (value.split('.')[1] || '').length;
  
  return floatValue.toFixed(Math.min(5, decimalPlaces));
}