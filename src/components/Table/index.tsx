"use client";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { useAppSelector } from "@/store";
import { useTranslations } from "next-intl";
import { Box, Typography, Button } from "@mui/material";

const data = [
  {
    id: "124125553",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
    statusDetails: {
      status: "Ожидает оплаты",
      amountSell: "500",
      sellCurrency: "Доллар США (USD)",
      buyerName: "Константинов Константин Иванович",
      creationDate: "17.08.2019 09:32:32",
      amountBuy: "897.324235252",
      buyCurrency: "Bitcoin (BTC)",
      paymentDetails: "DSFS32vdS†sxSDXXg{543XXGGG444",
      exchangeRate: "1 USD = 1.9043534543 BTC",
      paymentDeadline: "09:26",
    },
  },
  {
    id: "124125553",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
    statusDetails: {
      status: "Ожидает оплаты",
      amountSell: "500",
      sellCurrency: "Доллар США (USD)",
      buyerName: "Константинов Константин Иванович",
      creationDate: "17.08.2019 09:32:32",
      amountBuy: "897.324235252",
      buyCurrency: "Bitcoin (BTC)",
      paymentDetails: "DSFS32vdS†sxSDXXg{543XXGGG444",
      exchangeRate: "1 USD = 1.9043534543 BTC",
      paymentDeadline: "09:26",
    },
  },
  {
    id: "124125553",
    status: "Заявка создана",
    amountSell: "500 USD",
    name: "Константинов Константин Иванович",
    currency: "1 USD = 1.9043534543 BTC",
    amountBuy: "893.43534543 BTC",
    details: "2S143saFGGDS3XX",
    date: "17.07.2019 09:43:32",
    statusDetails: {
      status: "Ожидает оплаты",
      amountSell: "500",
      sellCurrency: "Доллар США (USD)",
      buyerName: "Константинов Константин Иванович",
      creationDate: "17.08.2019 09:32:32",
      amountBuy: "897.324235252",
      buyCurrency: "Bitcoin (BTC)",
      paymentDetails: "DSFS32vdS†sxSDXXg{543XXGGG444",
      exchangeRate: "1 USD = 1.9043534543 BTC",
      paymentDeadline: "09:26",
    },
  },
];

export const TradesTable = () => {
  const lang = useAppSelector((state) => state.auth.language);
  const t = useTranslations("Trades");

  const columns = useMemo<MRT_ColumnDef<typeof data[0]>[]>(
    () => [
      {
        accessorKey: "id",
        header: t("id"),
        size: 150,
      },
      {
        accessorKey: "status",
        header: t("status"),
        size: 150,
      },
      {
        accessorKey: "amountSell",
        header: t("amountSell"),
        size: 200,
      },
      {
        accessorKey: "name",
        header: t("name"),
        size: 200,
      },
      {
        accessorKey: "currency",
        header: t("currency"),
        size: 250,
      },
      {
        accessorKey: "amountBuy",
        header: t("amountBuy"),
        size: 200,
      },
      {
        accessorKey: "details",
        header: t("details"),
        size: 200,
      },
      {
        accessorKey: "date",
        header: t("date"),
        size: 200,
      },
    ],
    [t]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    localization: lang === "ru" ? MRT_Localization_RU : undefined,
    initialState: { density: "compact" },
    enableHiding: false,
    enableTopToolbar: false,
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        cursor: "pointer",
        marginBottom: '10px', // Add spacing between rows

      },
    }),
    renderDetailPanel: ({ row }) => (
      <Box sx={{ padding: 2 }}>
        <Typography variant="subtitle1">{t("status")}: {row.original.statusDetails.status}</Typography>
        <Typography>{t("amountSell")}: {row.original.statusDetails.amountSell} {row.original.statusDetails.sellCurrency}</Typography>
        <Typography>{t("name")}: {row.original.statusDetails.buyerName}</Typography>
        <Typography>{t("date")}: {row.original.statusDetails.creationDate}</Typography>
        <Typography>{t("amountBuy")}: {row.original.statusDetails.amountBuy} {row.original.statusDetails.buyCurrency}</Typography>
        <Typography>{t("details")}: {row.original.statusDetails.paymentDetails}</Typography>
        <Typography>{t("currency")}: {row.original.statusDetails.exchangeRate}</Typography>
        <Typography>{t("date")}: {row.original.statusDetails.paymentDeadline}</Typography>
        <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Оплатить
        </Button>
      </Box>
    ),
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
};
