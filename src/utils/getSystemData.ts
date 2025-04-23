import getTimeIST from './getTimeIST';
import os from 'os';
const getSystemInfo = () => {
    const uptime = os.uptime();
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();

    const currentTimeIST = getTimeIST();

    return {
        uptime: `${Math.floor(uptime / 3600)} hours ${Math.floor((uptime % 3600) / 60)} minutes`,
        platform,
        arch,
        hostname,
        currentTimeIST,
    };
};

export default getSystemInfo;