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
        Applications: 'Applications',
        AddInitialData: 'Add Demo Data',
        DatabaseBackup: 'Database backup',
    },
    dashboard: {
        Customers: 'Customers',
        Sales: 'Sales',
        Performance: 'Performance',
        Domains: 'Domains',
        DataEntities: 'Data Entities',
        DataEntitiesVisualRepresentation: 'Data Entities Visual Representation',
        ValueObjects: 'Value Objects',
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
        Applications: 'Aplicações',
        AddInitialData: 'Adicionar Demo Data',
        DatabaseBackup: 'Backup do Banco de Dados',
    },
    dashboard: {
        Customers: 'Clientes',
        Sales: 'Vendas',
        Performance: 'Performance',
        Domains: 'Domínios',
        DataEntities: 'Entidade de Dados',
        DataEntitiesVisualRepresentation: 'Representação Visual das Entidade de Dados',
        ValueObjects: 'Objetos Valor',
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
