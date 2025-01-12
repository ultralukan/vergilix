"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useAppSelector } from "@/store";
import { useMemo, useState } from "react";
import { createValidationSchema } from "../validation";
import { Form, Formik } from "formik";
import Input from "@/components/Input";
import Button from "@/components/Button";
import UploadForm from "@/components/Upload";
import UploadFormSupport from "@/components/UploadSupport";

export default function Support() {
  const t = useTranslations('Support');
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const t = useTranslations("FormContact");
  const e = useTranslations('Validation');
  // const a = useTranslations('API');
  // const [update] = useUpdateUserMutation();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true)
      // const { telegram, phone, name, surname, patronymic } = values;
      // const fullName = `${surname} ${name} ${patronymic}` ;
      // const response = await update({ telegram, fullName, phoneNumber: phone }).unwrap();
  
      // if (response) {
      //   resetForm();
      //   setSuccessMessage(t("successMessage"));
      //   setEdit(true);
      // }
    } catch (error) {
      // if (error && (error as ApiError).data) {
      //   const status = (error as ApiError).status;
  
      //   if ([400, 401, 404, 500].includes(status)) {
      //     setErrorMessage(a(`updateUser${status}`));
      //   } else {
      //     setErrorMessage("An unexpected error occurred");
      //   }
      // }
    } finally {
      setIsLoading(false);
    }
  };


  const initialValues = useMemo(() => {
    return {
      telegram: telegram,
      email: email,
      id: id,
      topic: topic,
      text: text,
    };
  }, [telegram, email, id, topic, text]);

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
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
        <Form>
          <div className={styles.form}>
          <div className={styles.formInputs}>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t("email")}
                name="email"
                type="email"
                value={email}
                setValue={setEmail}
                required
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t("telegram")}
                name="telegram"
                type="text"
                value={telegram}
                setValue={setTelegram}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t("id")}
                name="id"
                type="text"
                value={id}
                setValue={setId}
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t("topic")}
                name="topic"
                type="text"
                value={topic}
                setValue={setTopic}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItemFull}>
              <Input
                label={t("problem")}
                name="text"
                type="text"
                value={text}
                setValue={setText}
                multiline
                rows={5}
              />
            </div>
          </div>
          </div>
            <div className={styles.upload}>
              <UploadFormSupport label={t("uploadText")} errors={errors?.file} value={file} setValue={setFile}/>
            </div>
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
      )}}
    </Formik>
    </div>
  );
}
