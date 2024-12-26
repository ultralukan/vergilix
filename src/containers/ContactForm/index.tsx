'use client';

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { createValidationSchema } from "./validation";

export default function ContactForm() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [edit, setEdit] = useState(true);

  const t = useTranslations("FormContact");
  const e = useTranslations('Validation');

  const handleSubmit = () => {

  };

  const initialValues = useMemo(() => {
    return {
      login: login,
      email: email,
      phone: phone,
      name: name,
      surname: surname,
    };
  }, [name, email, surname, phone, login]);

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      // validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize
    >
      <Form className={styles.form}>
        <h5>{t("titleContact")}</h5>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <Input
              label={t("formLogin")}
              name="login"
              type="text"
              value={login}
              setValue={setLogin}
              disabled={edit}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <Input
              label={t("formEmail")}
              name="email"
              type="email"
              value={email}
              setValue={setEmail}
              disabled={edit}
            />
          </div>
          <div className={styles.formItem}>
            <Input
              label={t("formPhone")}
              name="phone"
              type="text"
              value={phone}
              setValue={setPhone}
              disabled={edit}
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
            />
          </div>
        </div>
        <div className={styles.button}>
          <Button
            label={edit ? t("formContactEdit") : t("formContactSave")}
            type={edit ? "button" : "submit"}
            onClick={() => setEdit(!edit)}
          />
        </div>
      </Form>
    </Formik>
  );
}
