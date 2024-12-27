"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { TradesTable } from "@/components/Table";

const data = [
  {
    id: "00000001",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000002",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000003",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000004",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000005",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000006",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000007",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "00000008",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
  {
    id: "0000000122",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
  },
];

export default function Trades() {
  const t = useTranslations("Trades");

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{t("title")}</h2>
      <TradesTable data={[...data,...data,...data,...data,...data,]}/>
    </div>
  );
}
