import DecodedUser from "./DecodedUser";

declare namespace Express {
    export interface Request {
        user?: DecodedUser;
    }
}
