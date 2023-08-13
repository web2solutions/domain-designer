import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

const _time_out_ = 3000;

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
        closer: setTimeout(() => {}, _time_out_),
    }),
    actions: {
        success(message: string) {
            this.alert = { message, type: 'notification is-success' };
            this.show = true;
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: _time_out_,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
            })
            Toast.fire({
                icon: 'success',
                title: 'Info',
                text: message,
            });
            clearTimeout(this.closer);
            this.closer = setTimeout(() => this.show = false, _time_out_)
        },
        error(message: string) {
            this.alert = { message, type: 'notification is-danger' };
            this.show = true;
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: _time_out_,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
            })
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
            clearTimeout(this.closer);
            this.closer = setTimeout(() => this.show = false, _time_out_)
        },
        warning(message: string) {
            this.alert = { message, type: 'notification is-warning' };
            this.show = true;
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: _time_out_,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
            })
            Toast.fire({
                icon: 'warning',
                title: 'Warning',
                text: message,
            });
            clearTimeout(this.closer);
            this.closer = setTimeout(() => this.show = false, _time_out_)
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
