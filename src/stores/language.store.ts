import { defineStore } from 'pinia';

const enUS: Record<string, any> = {
    application: {
        searchEverywhere: 'Search everywhere',
        Notifications: 'Notifications',
        MyProfile: 'My Profile',
        Settings: 'Settings',
        Messages: 'Messages',
        LogOut: 'Log Out',
        Home: 'Home',
        Dashboard: 'Dashboard',
    },
    dashboard: {
        Clients: 'Clients',
        Sales: 'Sales',
        Performance: 'Performance',
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
        Home: 'Início',
        Dashboard: 'Dashboard',
    },
    dashboard: {
        Clients: 'Clientes',
        Sales: 'Vendas',
        Performance: 'Performance',
    }
}

type languages = 'en-US' | 'pt-BR';

const implementedLanguages: Record<languages, Record<string, any>> = {
    'en-US': enUS,
    'pt-BR': ptBR,
};

// session.locale.language
// Intl.DateTimeFormat().resolvedOptions().locale
export const useLanguageStore = defineStore({
    id: 'language',
    state: () => ({
        default: {
            ...enUS
        },
        language: 'en-US',
        languages: [
            'en-US',
            'pt-BR',
        ]
    }),
    actions: {
        change(language: languages) {
            this.language = language;
            this.default = { ...implementedLanguages[language] };
        }
    }
});
