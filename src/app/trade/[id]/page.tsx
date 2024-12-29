"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Box, InputAdornment, Step, StepLabel, Stepper, SxProps, useStepContext } from "@mui/material";
import { Theme } from "@emotion/react";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Image from "next/image";
import Button from "@/components/Button";
import { createValidationSchemaStep1 } from "./validation";
import TimerIcon from "../../../../public/timer.svg";
import { useAppSelector } from "@/store";
import { getIconPath, isFiat } from "@/services/exchange";
import { useParams, useRouter } from "next/navigation";
import { useGetUserTradeQuery, useUpdateTradeMutation } from "@/api/trades";
import Timer from "@/components/Timer";
import { LinearIndeterminate } from "@/components/Progress";
import ModalComponent from "@/components/Modal";
import ArrowIcon from '../../../../public/arrow.svg';
import { formatDate } from "@/services/dates";

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

const customStyles: SxProps<Theme> = {
  "& .MuiInputBase-input": {
    padding: '15px',
    fontWeight: 'bold',
    fontSize: '24px',
    WebkitTextFillColor: 'black',
  },
  "& .MuiInputBase-root": {
    backgroundColor: '#F2F4F7 !important',
    boxShadow: 'none'
  }
}

const isValidId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

function Trade() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('Trade');
  const e = useTranslations('Validation');
  const [activeStep, setActiveStep] = useState(1);
  const user = useAppSelector((state) => state.auth.user);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateTrade] = useUpdateTradeMutation();
  const lang = useAppSelector((state) => state.auth.language);
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
  const [modal, setModal] = useState(false);

  const handleCopy = (value: string, field: string) => {
    if (value) {
      navigator.clipboard.writeText(value)
        .then(() => {
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  const { data: trade = null, error, isFetching } = useGetUserTradeQuery(id as string, { skip: !id });

  const iconFrom = useMemo(() => {
    if(trade?.fromCurrency) {
      return getIconPath(trade?.fromCurrency)
    }
    else return null
  }, [trade?.fromCurrency]);

  const iconTo = useMemo(() => {
    if(trade?.toCurrency) {
      return getIconPath(trade?.toCurrency)
    }
    else return null
  }, [trade?.toCurrency]);

  const isFiatFrom = useMemo(() => {
    if(trade?.fromCurrency && isFiat(trade?.fromCurrency)) {
      return true;
    }
    return false
  }, [trade])

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState(""); 

	useEffect(() => {
    if (error || !id || !isValidId(id as string)) {
      setModal(true)
      setModalContent({
        title: t("modalErrorTitle"),
        text: t("modalErrorText"),
        btn: t("modalErrorBtn"),
        status: false,
        onButtonClick: () => router.replace("/"),
      });
    }
  }, [id, router, error, t]);

  useEffect(() => {
    if(trade?.status === 'cancelled') {
      router.replace("/");
    } else if(trade?.status === 'paid') {
      setActiveStep(2)
    } 
  }, [router, trade])

  useEffect(() => {
    if(trade) {
      if(trade?.amount) {
        setAmount(trade?.amount)
      }
      if(trade?.accountNumber) {
        setAccountNumber(trade?.accountNumber)
      }
    }
  }, [trade])

  console.log(accountNumber)

  const steps = [
    t('stepTitle1'),
    t('stepTitle2'),
    t('stepTitle3'),
  ];

  const handleNext = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
  };

  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const handleClose = () => setModal(false);

  const initialValuesStep1 = useMemo(() => {
    return ({
      amount: amount,
      accountNumber: accountNumber,
    })
  }, [amount, accountNumber])

  function step1() {
    return (
      <Formik
        initialValues={initialValuesStep1}
        onSubmit={handleSubmitStep1}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        {() => (
          <Form className={styles.form}>
            <div className={styles.details}>
              <div className={styles.cardsWrapper}>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>
                    {isFiatFrom ? t("getTitle") : t("sendTitle")}
                  </p>
                  <div className={styles.inputRow}>
                    <Input
                      name="amount"
                      type="text"
                      disabled
                      value={amount}
                      InputProps={{
                        endAdornment: trade?.fromCurrency ? (
                          <InputAdornment position="end">
                            <Image
                              src={iconFrom}
                              alt={trade?.fromCurrency}
                              width={40}
                              height={40}
                            />
                          </InputAdornment>
                        ) : null,
                      }}
                      customStyles={customStyles}
                    />
                    <div className={styles.copyWrapper}>
                      <Image
                        src="/copy.svg"
                        alt="copy"
                        width={30}
                        height={30}
                        onClick={() => handleCopy(amount, "amount")}
                        className={styles.copy}
                      />
                      {copiedField === "amount" && (
                        <span className={styles.copiedMessage}>{t("copyText")}</span>
                      )}
                    </div>
                  </div>
                </div>
  
                <div className={styles.card}>
                  <p className={styles.cardTitle}>{t("walletTitle")}</p>
                  <div className={styles.inputRow}>
                    <Input
                      name="accountNumber"
                      type="text"
                      disabled
                      value={accountNumber}
                      setValue={setAccountNumber}
                      customStyles={customStyles}
                    />
                    <div className={styles.copyWrapper}>
                      <Image
                        src="/copy.svg"
                        alt="copy"
                        width={30}
                        height={30}
                        onClick={() =>
                          handleCopy(accountNumber, "accountNumber")
                        }
                        className={styles.copy}
                      />
                      {copiedField === "accountNumber" && (
                        <span className={styles.copiedMessage}>{t("copyText")}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
  
              <div className={styles.timerWrapper}>
                <div className={styles.timerContainer}>
                  <h5>{t("timerTitle")}</h5>
                  <div className={styles.timer}>
                    <Timer 
                      createdAt={trade?.createdAt} 
                      onComplete={() => router.push("/")} 
                    />
                  </div>
                </div>
                <div className={styles.timerInfo}>
                  <Image src="/timer.png" alt="copy" width={90} height={90} />
                  <div className={styles.timerText}>{t("timerText")}</div>
                </div>
              </div>
  
              <div className={styles.buttons}>
                <div className={styles.button}>
                  <Button label={t("btCompleteTrade")} type="button" onClick={handleClickButtonStep1} />
                </div>
                <button className={styles.buttonCanc} type="button" onClick={handleClickButtonCancel}>
                  <Image src="/cancel.svg" alt="copy" width={20} height={20} />
                  {t("btCancelTrade")}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
  

  function step2() {
    return(
      <div className={styles.resultsWrapper}>
        <div className={styles.results}>
          <div className={styles.resultInfo}>
            <div className={styles.cardTitle}>{t("payTitle")}:</div>
            <div className={styles.paymentResult}>
              <span>{trade?.amount}</span>
              <span>
                <Image
                  src={iconFrom}
                  alt={trade?.fromCurrency}
                  width={40}
                  height={40}
                  className={styles.resultIcon}
                />   
                {trade?.fromCurrency}
                </span>
              <ArrowIcon className={styles.arrowIcon}/> 
              <span>{trade?.receivedAmount}</span>    
              <span>
                <Image
                  src={iconTo}
                  alt={trade?.toCurrency}
                  width={40}
                  height={40}
                  className={styles.resultIcon}
                />  
                {trade?.toCurrency}
                </span>
            </div>
          </div>
          <div className={styles.paymentDetails}>
            <div className={styles.cardTitle}>{t("detailsTitle")}:</div>
            <div className={styles.paymentDetailsWrapper}>
              <div>
                <p>{t("detailsId")}:</p>
                <p>{t("detailsDate")}:</p>
              </div>
              <div>
                <p>{trade?._id}</p>
                <p>{formatDate(trade?.createdAt)[lang]}</p>
              </div>
            </div>
          </div>
          <div className={styles.resultButton}>
            <Button label={t("resultButton")} type="button" onClick={() => router.replace('/')}/>
          </div>
        </div>
        <div className={styles.video}>
          <Image
            src={"/roof.svg"}
            alt="roof"
            width={300}
            height={300}
            className={styles.videoImage}
          />
          <video
            controls
            width="100%"
            height="auto"
            preload="metadata"
            loop
            autoPlay
            muted
          >
            <source src="/promo.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )
  }

  const handleClickButtonStep1 = () => {
    setModalContent({
      title: t("modalSubmitStep1Title"),
      status: true,
      btn: t("btCompleteTrade"),
      onButtonClick: () => handleSubmitStep1('paid'),
    });
    setModal(true);
  }

  const handleClickButtonCancel = () => {
    setModalContent({
      title: t("modalCancelStep1Title"),
      btn: t("btCancelTrade"),
      onButtonClick: () => {
        handleSubmitStep1('cancelled');
        router.replace('/')
      },
      status: true
    });
    setModal(true);
  }


  const handleSubmitStep1 = async(status) => {
    try {
      handleClose();
      setIsLoading(true);
      const response = await updateTrade({ id: trade._id, data: { status: status } }).unwrap();
      
      if(response) {
        handleNext()
      }
    } catch (error: unknown) {
      if (error && (error as ApiError).data) {
        setModalContent({
          title: t("modalErrorTitle"),
          text: t("modalErrorText"),
          btn: t("modalErrorBtn"),
          status: false,
        });
        setModal(true);
      }
    } finally {
      setIsLoading(false);
      sessionStorage.removeItem('exchangeForm')
    }
  }

  return (
    <div className={styles.page}>
      {!isFetching && (
        <>
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
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
      <h2 className={styles.formTitle}>{t(`titleStep${activeStep}`)}</h2>
        </>
      )}
      {isFetching && ( <Box className={styles.linear}>
          <LinearIndeterminate />
        </Box>) }
          {
            !isFetching && trade && (
              activeStep === 1 ? step1() :
              activeStep === 2 ? step2() :
              null
            )
          }
          <ModalComponent 
            open={modal} 
            onClose={handleClose} 
            title={modalContent.title} 
            content={modalContent.text}
            btnText={modalContent.btn}
            status={modalContent.status}
            onButtonClick={modalContent.onButtonClick}
          />
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