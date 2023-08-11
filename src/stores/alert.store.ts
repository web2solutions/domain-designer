import { defineStore } from 'pinia';
// import Swal from 'sweetalert2';

interface IAlertRecord {
    message: string;
    type: string;
}

export type AlertRecord = IAlertRecord | null;

const emptyAlert = { message: '', type: '' };

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
        alert: { ...emptyAlert },
        show: false,
    }),
    actions: {
        success(message: string) {
            this.alert = { message, type: 'notification is-success' };
            this.show = true;
        },
        error(message: string) {
            this.alert = { message, type: 'notification is-danger' };
            this.show = true;
        },
        warning(message: string) {
            this.alert = { message, type: 'notification is-warning' };
            this.show = true;
        },
        info(message: string) {
            this.alert = { message, type: 'notification is-info' };
            this.show = true;
        },
        link(message: string) {
            this.alert = { message, type: 'notification is-link' };
            this.show = true;
        },
        clear() {
            this.alert = { ...emptyAlert };
            this.show = false;
        }
    }
});
