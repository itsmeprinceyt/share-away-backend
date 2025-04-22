import chalk from 'chalk';
import moment from 'moment-timezone';

export const logger = (
    type: string,
    message: string,
    params: Record<string, any> = {}
) => {
    const istTime = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const timeColor = chalk.cyan(`[${istTime}]`);
    const typeColor = chalk.yellow.bold(`[${type.toUpperCase().padEnd(7)}]`);
    const messageColor = chalk.hex('#ff69b4')(`{ ${message} }`);

    const baseLog = `${timeColor} ${typeColor} - ${messageColor}`;
    const hasParams = Object.keys(params).length > 0;

    if (hasParams) {
        const paramColor = chalk.green(JSON.stringify(params, null, 2));
        console.log(`${baseLog} | Parameters:\n${paramColor}\n`);
    } else {
        console.log(`${baseLog}\n`);
    }
};
