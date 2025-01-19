'use client';

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useEffect, useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { createValidationSchema } from "./validation";
import { useAppSelector } from "@/store";
import { ApiError } from "@/types/error";
import { useUpdateUserMutation } from "@/api/user";

export default function ContactForm() {
  const user = useAppSelector((state) => state.auth.user);
  const [telegram, setTelegram] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [edit, setEdit] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("FormContact");
  const e = useTranslations('Validation');
  const a = useTranslations('API');
  const [update] = useUpdateUserMutation();

  useEffect(() => {
    try {
      if (user && Object.keys(user) && Object.keys(user).length) {
        if (user?.telegram) setTelegram(user.telegram);
        if (user?.phoneNumber) setPhone(user.phoneNumber);
        if (user?.fullName) {
          user?.fullName.split(" ").map((el, index) => {
            if(index === 0) {
              setSurname(el);
            } else if (index === 1) {
              setName(el);
            } else if (index === 2) {
              setPatronymic(el);
            }
          })
        };
      }
    } catch {
    }
  }, [user]);
  

  const handleSubmit = async (values, { resetForm }) => {
    if (edit) return;
    
    try {
      setSuccessMessage("");
      setErrorMessage("");
      setIsLoading(true)
      const { telegram, phone, name, surname, patronymic } = values;
      const fullName = `${surname} ${name} ${patronymic}` ;
      const response = await update({ telegram, fullName, phoneNumber: phone }).unwrap();
  
      if (response) {
        resetForm();
        setSuccessMessage(t("successMessage"));
        setEdit(true);
      }
    } catch (error) {
      if (error && (error as ApiError).data) {
        const status = (error as ApiError).status;
  
        if ([400, 401, 404, 500].includes(status)) {
          setErrorMessage(a(`updateUser${status}`));
        } else {
          setErrorMessage("An unexpected error occurred");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };


  const initialValues = useMemo(() => {
    return {
      telegram: telegram,
      phone: phone,
      name: name,
      surname: surname,
      patronymic: patronymic,
    };
  }, [name, telegram, surname, phone, patronymic]);

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize
    >
      <Form className={styles.form}>
      {errorMessage ? <h5 className={styles.titleError}>{errorMessage}</h5> : successMessage ? <h5 className={styles.title}>{t('successMessage')}</h5> : null}
        <h5 className={styles.header}>{t("titleContact")}</h5>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <Input
              label={t("formTelegram")}
              name="telegram"
              type="text"
              value={telegram}
              setValue={setTelegram}
              disabled={edit}
            />
          </div>
          <div className={styles.formItem}>
            <Input
              label={t("formPhone")}
              name="phone"
              type="number"
              value={phone}
              setValue={setPhone}
              disabled={edit}
              required
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <Input
              label={t("formName")}
              name="name"
              type="text"
              value={name}
              setValue={setName}
              disabled={edit}
              required
            />
          </div>
          <div className={styles.formItem}>
            <Input
              label={t("formSurname")}
              name="surname"
              type="text"
              value={surname}
              setValue={setSurname}
              disabled={edit}
              required
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <Input
              label={t("formPatronymic")}
              name="patronymic"
              type="text"
              value={patronymic}
              setValue={setPatronymic}
              disabled={edit}
            />
          </div>
        </div>
        <div className={styles.button}>
          <Button
            label={edit ? t("formContactEdit") : t("formContactSave")}
            type={edit ? "button" : "submit"}
            isLoading={isLoading}
            disabled={isLoading}
            onClick={(e) => {
              if (edit) {
                e.preventDefault();
                setEdit(false);
              }
            }}
          />
        </div>
      </Form>
    </Formik>
  );
}
