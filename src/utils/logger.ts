import chalk from 'chalk';
import getTimeIST from './getTimeIST';

export const logger = (
    type: string,
    message: string,
    params: Record<string, any> = {}
) => {
    const istTime = getTimeIST();

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
