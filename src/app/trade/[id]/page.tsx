"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import {Box, FormControl, InputAdornment, MenuItem, Select, Step, StepLabel, Stepper, SxProps} from "@mui/material";
import { Theme } from "@emotion/react";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Image from "next/image";
import Button from "@/components/Button";
import { useAppSelector } from "@/store";
import { getIconPath, isFiat } from "@/services/exchange";
import { useParams, useRouter } from "next/navigation";
import { useGetUserTradeQuery, useUpdateTradeMutation } from "@/api/trades";
import Timer from "@/components/Timer";
import { LinearIndeterminate } from "@/components/Progress";
import ModalComponent from "@/components/Modal";
import ArrowIcon from '../../../../public/arrow.svg';
import { formatDate } from "@/services/dates";
import { createValidationSchema } from "./validation";
import {black} from "next/dist/lib/picocolors";

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
  "& .MuiInputBase-multiline": {
    padding: '0 !important',
  },
  "& .MuiInputBase-input, .MuiInputBase-multiline": {
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

const getMaxLength = (currency: string, network?: string): number => {
  switch (currency) {
    case "BTC":
      return 35;
    case "ETH":
    case "DAI":
      return 42;
    case "USDT":
    case "USDC":
      switch (network) {
        case "eth":
          return 42;
        case "tron":
          return 34;
        default:
          return 0;
      }
    default:
      return 0;
  }
};

function Trade() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('Trade');
  const e = useTranslations('Validation');
  const [activeStep, setActiveStep] = useState(1);
  const user = useAppSelector((state) => state.auth.user);
  const [network, setNetwork] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const iconFrom = useMemo(() => trade?.fromCurrency ? getIconPath(trade.fromCurrency) : null, [trade?.fromCurrency]);

  const iconTo = useMemo(() => trade?.toCurrency ? getIconPath(trade.toCurrency) : null, [trade?.toCurrency]);
  
  const isFiatFrom = useMemo(() => isFiat(trade?.fromCurrency), [trade]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("body-lock");
    } else {
      document.body.classList.remove("body-lock");
    }
    return () => {
      document.body.classList.remove("body-lock");
    };
  }, [isMenuOpen]);

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const networkOptions = useMemo(() => {
    return trade?.wallets
  }, [trade])

	useEffect(() => {
    if (error || !id || !isValidId(id as string)) {
      setModal(true)
      setModalContent({
        title: t("modalErrorTitle"),
        text: t("modalErrorText"),
        btn: t("modalErrorBtn"),
        status: false,
        onButtonClick: () => router.replace("/"),
        onClose: () => router.replace("/"),
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
      if(isFiatFrom) {
        if(trade?.receivedAmount) {
          setAmount(trade?.receivedAmount)
        }
      } else {
        if(trade?.amount) {
          setAmount(trade?.amount)
        }
        if(trade?.accountNumber) {
          setAccountNumber(trade?.accountNumber)
        }
      }
    }
  }, [trade, isFiatFrom])

  useEffect(() => {
    if(network?.address) {
      setAccountNumber(network.address)
    }
  }, [network, setAccountNumber])

  const steps = useMemo(() => {
    return ([
      t('stepTitle1'),
      t(isFiatFrom ? 'stepTitleFiat2' : 'stepTitle2'),
      t('stepTitle3'),
    ])
  }, [t, isFiatFrom])

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

  const validationSchema = useMemo(() => createValidationSchema(e, isFiatFrom ? trade?.toCurrency : trade?.fromCurrency, network?.network), [isFiatFrom, e, trade?.fromCurrency, trade?.toCurrency, network?.network]);

  const renderModalInputs = () => {
    return(
      <div className={styles.modalResult}>
        <div className={styles.modalResultWrapper}>
        <div className={styles.modalResultRow}>
        <span className={styles.modalResultInput}>
          <span>{trade?.amount}</span>
          {trade?.fromCurrency}
        </span>
        </div>
        <ArrowIcon className={styles.arrowIcon}/> 
        <div className={styles.modalResultRow}>
          <span className={styles.modalResultInput}>
            <span>{trade?.receivedAmount}</span>
            {trade?.toCurrency}
          </span>
        </div>
        </div>
        <div className={styles.modalResultRows}>
          <div className={styles.modalResultRow}>
            <p className={styles.cardTitle}>
              {t("walletTitle")}:
            </p>
            <span className={styles.modalResultInput}>
              {accountNumber}
            </span>
          </div>
        </div>
        <p className={styles.cardTitleId}>
              {t("detailsId")}: {trade?._id}
            </p>
      </div>
    )
  }

  const onCompleteTimer = () => {
    setModal(true)
    setModalContent({
      title: t("modalTimerTitle"),
      text: t("modalTimerText"),
      btn: t("modalTimerBtn"),
      status: true,
      text: renderModalInputs(),
      onButtonClick: () => router.replace("/"),
      onClose: () => router.replace("/"),
    });
  }

  function step1() {
    return (
      <Formik
        initialValues={initialValuesStep1}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        {() => (
          <Form className={styles.form}>
            <div className={styles.details}>
              <div className={styles.cardsWrapper}>
                <div className={styles.card}>
                  <div className={styles.network}>
                    <p className={styles.cardTitle}>
                      {isFiatFrom ? t("getTitle") : t("sendTitle")}
                    </p>
                  </div>
                  <div className={styles.inputRow}>
                    <Input
                      name="amount"
                      type="text"
                      disabled
                      value={amount}
                      InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                          <Image
                            src={isFiatFrom ? iconTo : iconFrom}
                            alt={trade?.fromCurrency}
                            width={40}
                            height={40}
                          />
                        </InputAdornment>
                        )
                      }}
                      required
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
                  <div className={styles.network}>
                    <p className={styles.cardTitle}>{t("walletTitle")}</p>
                    {
                      !!networkOptions.length && (
                        <FormControl
                          sx={{
                            width: "100%",
                            "@media (min-width: 480px)": {
                              width: 160,
                              marginLeft: "0",
                              alignItems: 'end',
                            },
                            display: 'flex',
                            textTransform: "uppercase"
                          }}
                          fullWidth
                          required
                        >
                          <Select
                            labelId="network-select-label"
                            value={network}
                            onChange={(e) => {
                              setNetwork(e.target.value as string)
                              setIsMenuOpen(false)
                            }}
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: "gray" }}>{t("network")}</span>;
                              }
                              return selected.network;
                            }}
                            className={styles.select}
                            sx={{
                              background: "#F3F5F7",
                              width: 160,
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                              "&:before": {
                                display: "none",
                              },
                              "&:after": {
                                display: "none",
                              },
                              "& .MuiSelect-select": {
                                position: "relative",
                                top: '5px',
                                fontWeight: "bold",
                                color: black,
                                fontSize: "20px",
                                letterSpacing: "-0.5px",
                                "@media (min-width: 480px)": {
                                  padding: "4px 10px",
                                },
                              },
                              "& .MuiSelect-icon": {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                top: "0",
                              },
                            }}
                            IconComponent={(props) => (<Image src={"/dropdown.svg"} width={15} height={15} alt="more" {...props}/>)}
                            MenuProps={{
                              open: isMenuOpen,
                              onClose: () => setIsMenuOpen(false),
                            }}
                            onOpen={() => setIsMenuOpen(true)}
                          >
                            {networkOptions.map((option, index) => (
                              <MenuItem key={index} value={option} sx={{textTransform: "uppercase"}}>
                                {option.network}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )
                    }
                  </div>
                  <div className={styles.inputRow}>
                  <Input
                      name="accountNumber"
                      type="text"
                      disabled={!isFiatFrom}
                      value={accountNumber}
                      setValue={setAccountNumber}
                      customStyles={customStyles}
                      maxRows={3}
                      multiline
                      slotProps={{ htmlInput: { maxLength: isFiatFrom ? getMaxLength(isFiatFrom ? trade?.toCurrency : trade?.fromCurrency, network?.network) : "" } }}
                      required
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
                      onComplete={onCompleteTimer} 
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
                  <Button isLoading={isLoading} disabled={isLoading} label={ isFiatFrom ? t("btCompleteTradeFiat") : t("btCompleteTrade")} type="submit" />
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
          <div className={styles.cardTitle}>
            {isFiatFrom ? (
              <>
                <div>{t("payTitleFiat")}</div>
                <div>{t("payTitleFiat2")}</div>
              </>
            ) : (
              <>
              {t("payTitle")}:
              </>
            )}
          </div>
            {!isFiatFrom && (
                          <div className={styles.paymentResult}>
                          <span>
                            {trade?.amount}
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
                          <span>
                          {trade?.receivedAmount}
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
            )}
          </div>
          <div className={styles.paymentDetails}>
            <div className={styles.cardTitle}>{t("detailsTitle")}:</div>
            <div className={styles.paymentDetailsWrapper}>
              <div>
                <p>{t("detailsId")}: <b>{trade?._id}</b></p>
                <p>{t("detailsDate")}: <b>{formatDate(trade?.createdAt)[lang]}</b></p>
              </div>
              {/* <div>
                <p>{trade?._id}</p>
                <p></p>
              </div> */}
            </div>
          </div>
          <div className={styles.resultButton}>
            <Button label={t("resultButton")} type="button" onClick={() => router.replace('/profile?tab=trades')}/>
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
            playsInline
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
    if(isFiatFrom) {
    setModalContent({
      title: t("modalSubmitStep1TitleFiat"),
      status: true,
      btn: t("btCompleteTradeFiat"),
      onButtonClick: () => handleSubmitStep1('paid'),
      text: renderModalInputs(),
    });
    setModal(true);
    } else {
      setModalContent({
        title: t("modalSubmitStep1Title"),
        status: true,
        btn: t("btCompleteTrade"),
        onButtonClick: () => handleSubmitStep1('paid'),
        text: renderModalInputs(),
      });
      setModal(true);
    }
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

  const handleSubmit = () => {
    handleClickButtonStep1();
  }

  const handleSubmitStep1 = async(status) => {
    try {
      handleClose();
      setIsLoading(true);
      const response = await updateTrade({ id: trade._id, data: { status: status, network: (isFiatFrom && network) ? network?.network : undefined, accountNumber } }).unwrap();
      
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
                  },
                  '& .MuiStep-root': {
                    fontWeight: 'bold',
                    "@media (max-width: 768px)": {
                      padding: 0,
                    },
                  },
                  '& .MuiStepLabel-iconContainer': {
                    "@media (max-width: 768px)": {
                      padding: 0,
                    },
                  },
                  "@media (min-width: 768px)": {
                    fontSize: "20px",
                  },
                  "& .Mui-active": {
                    svg: {
                      text: {
                        fill: 'black !important',
                      }
                    },
                    '& .MuiStepConnector-line': {
                      borderColor: '#71E0C1',
                    },
                  }
                }
              }
              >
              {steps.map((label) => (
                <Step key={label} sx={baseStyles}>
                  <StepLabel><span className={styles.step}>{label}</span></StepLabel>
                </Step>
              ))}
            </Stepper>
        <h2 className={styles.formTitle}>{activeStep === 2 && isFiatFrom ? t(`titleStep${activeStep}Fiat`) : t(`titleStep${activeStep}`)}</h2>
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
            onClose={modalContent?.onClose || handleClose} 
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