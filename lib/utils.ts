import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function currentDate() {
    var m = new Date();
    return m.getFullYear() + "-" +
        ("0" + (m.getMonth()+1)).slice(-2) + "-" +
        ("0" + m.getDate()).slice(-2) + " " +
        ("0" + m.getHours()).slice(-2) + ":" +
        ("0" + m.getMinutes()).slice(-2) + ":" +
        ("0" + m.getSeconds()).slice(-2) + "." +
        ("0" + m.getMilliseconds()).slice(-3);
}

export function log(message: any) {
    console.log(currentDate() + " " + message);
}

export function logwarn(message: any) {
    console.warn(currentDate() + " " + message);
}

export function logerr(message: any) {
    console.error(currentDate() + " " + message);
}

export function logerr2(message: any, err: unknown) {
    console.error(currentDate() + " " + message, err);
}
