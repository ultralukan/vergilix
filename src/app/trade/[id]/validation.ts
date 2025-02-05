import * as Yup from 'yup';
import { TranslationsType } from './types';

const validateBTCAddress = (address: string) => {
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address);
};

const validateETHAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const validateTRCAddress = (address: string) => {
  return /^T[a-zA-HJ-NP-Z0-9]{33}$/.test(address);
};

export const createValidationSchema = (e: TranslationsType, currency: string, network?: string) => {
  return Yup.object().shape({
    amount: Yup.string()
      .typeError(e("typeError"))
      .required(e("required")),
    accountNumber: Yup.string()
      .typeError(e("typeError"))
      .required(e("required"))
      .test({
        name: 'validate-wallet-address',
        message: e("invalidWalletAddress"),
        test: function (value) {
          if (!value) return false;
          switch (currency) {
            case 'BTC':
              return validateBTCAddress(value);

            case 'ETH':
            case 'DAI':
              return validateETHAddress(value);

            case 'USDT':
            case 'USDC':
              switch (network) {
                case "eth":
                  return validateETHAddress(value);
                case "tron":
                  return validateTRCAddress(value);
                default:
                  return false;
              }
            default:
              return false;
          }
        },
      }),
  });
};