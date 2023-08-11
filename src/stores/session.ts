export type dtStyle = "medium" | "short" | "full" | "long" | undefined
interface ILocale  {
    timeZone: string;
    language: string;
    dateStyle: dtStyle; 
    timeStyle: dtStyle;
}

interface ISession {
    user: unknown;
    locale: ILocale;
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const language = Intl.DateTimeFormat().resolvedOptions().locale;

export const session: ISession = {
    user: {
        name: 'Jose Almeida',
        account: {
            username: 'web2solucoes@gmail.com',
            password: '123456',
        }
    },
    locale: {
        timeZone,
        language,
        dateStyle: 'medium', 
        timeStyle: 'short'
    }
};