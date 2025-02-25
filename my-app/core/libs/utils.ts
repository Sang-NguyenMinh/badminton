import { Buffer } from 'buffer';
import moment from 'moment';

export const decodeToken = (token: string) => {
    try {
        const payload = token.split('.')[1];

        const decoded = JSON.parse(Buffer.from(payload, 'base64')?.toString());

        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const  formatCurrency= (amount: number): string => {
    // Định dạng số theo kiểu tiếng Việt
    const formattedNumber = new Intl.NumberFormat('vi-VN').format(amount);
    return `${formattedNumber} VND`;
  }


  export const dateToString=(date:Date|string):string =>{
    return moment(date).format('MM/DD/YYYY')
  }