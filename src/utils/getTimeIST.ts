import moment from 'moment-timezone';

const getTimeIST = (): string => {
    return moment.utc().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
};

export default getTimeIST;