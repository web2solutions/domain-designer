import { defineStore } from 'pinia';
// import { session } from '.';

const enUS: Record<string, any> = {
    application: {
        searchEverywhere: 'Search everywhere',
        Notifications: 'Notifications',
        MyProfile: 'My Profile',
        Settings: 'Settings',
        Messages: 'Messages',
        LogOut: 'Log Out',
    }
};

const ptBR: Record<string, any> = {
    application: {
        searchEverywhere: 'Busca global',
        Notifications: 'Notificações',
        MyProfile: 'Meu Perfil',
        Settings: 'Configurações',
        Messages: 'Mensagens',
        LogOut: 'Sair',
    }
}

type languages = 'en-US' | 'pt-BR';

export const implementedLanguages: Record<languages, Record<string, any>> = {
    'en-US': enUS,
    'pt-BR': ptBR,
};

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const language = Intl.DateTimeFormat().resolvedOptions().locale;

// session.locale.language
export const useSessionStore = defineStore({
    id: 'session',
    state: () => ({
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
    }),
    actions: {
        setLanguage(language: languages) {
            this.locale = { ...this.locale, language };
        }
    }
});
