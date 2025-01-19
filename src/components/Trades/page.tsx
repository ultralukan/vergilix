"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { TradesTable } from "@/components/Table";
import { useGetAllUserTradesQuery } from "@/api/trades";
import { Box } from "@mui/material";
import { LinearIndeterminate } from "@/components/Progress";

// const data = [
//   {
//     id: "00000001",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000002",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000003",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000004",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000005",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000006",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000007",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "00000008",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
//   {
//     id: "0000000122",
//     status: "Заявка создана",
//     amountSell: "500 USD",
//     name: "Константинов Константин Иванович",
//     currency: "1 USD = 1.9043534543 BTC",
//     amountBuy: "893.43534543 BTC",
//     details: "2S143saFGGDS3XX",
//     date: "17.07.2019 09:43:32",
//   },
// ];

export default function TradesComponent() {
  const t = useTranslations("Trades");
  const {data = [], isFetching} = useGetAllUserTradesQuery();

  return (
    <div className={styles.page}>
      <h5 className={styles.title}>{t("title")}</h5>
      {isFetching ? ( <Box className={styles.linear} sx={{marginTop: '20px'}}>
          <LinearIndeterminate />
        </Box>) :
      <TradesTable data={data}/>
      }
    </div>
  );
}
