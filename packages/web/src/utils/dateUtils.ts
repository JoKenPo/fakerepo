import addMinutes from "date-fns/addMinutes";
import format from "date-fns/format";

export enum ETimeZoneTypes {
    HORA_LOCAL,
    HORA_BRASILIA
}

export function formatDate(date: Date, template: string, timeZoneType: ETimeZoneTypes = ETimeZoneTypes.HORA_LOCAL): string {
    const res = timeZoneType === ETimeZoneTypes.HORA_LOCAL ? format(date, template) : format(addMinutes(date, date.getTimezoneOffset()), template);
    return res
}


export function calculaIdade(nascimento: Date): number {
    return Math.floor(Math.ceil(Math.abs(nascimento.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) / 365.25);
}

export const nomeMes = (mes: number): string => {
    switch (mes) {
        case 1: return 'Janeiro';
        case 2: return 'Fevereiro';
        case 3: return 'Março';
        case 4: return 'Abril';
        case 5: return 'Maio';
        case 6: return 'Junho';
        case 7: return 'Julho';
        case 8: return 'Agosto';
        case 9: return 'Setembro';
        case 10: return 'Outubro';
        case 11: return 'Novembro';
        case 12: return 'Dezembro';
    }
}

export const nomeMesAbr = (mes: number): string => {
    switch (mes) {
        case 1: return 'Jan';
        case 2: return 'Fev';
        case 3: return 'Mar';
        case 4: return 'Abr';
        case 5: return 'Mai';
        case 6: return 'Jun';
        case 7: return 'Jul';
        case 8: return 'Ago';
        case 9: return 'Set';
        case 10: return 'Out';
        case 11: return 'Nov';
        case 12: return 'Dez';

    }
}
