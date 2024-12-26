import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => {
  const locale = 'ru';
 
  return {
    locale,
    messages: (await import(`../public/messages/${locale}.json`)).default
  };
});