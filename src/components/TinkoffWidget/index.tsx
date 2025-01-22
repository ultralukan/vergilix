import Script from 'next/script';
import styles from "./index.module.scss";

export default function PayWidget() {
  return (
    <div className={styles["pay-widget-container"]}>
      <Script
        src="https://w.tb.ru/open-messenger/widget?wId=W-3B355D5F349340A6AFEBD5210541E2E3"
        strategy="afterInteractive"
      />
    </div>
  );
}
