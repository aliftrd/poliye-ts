import {Browser, Protocol} from "puppeteer";

type SuccessResponse = {
    code: number;
    message: string;
    data: any;
}

type ErrorResponse = {
    code: number;
    message: string;
    error?: any;
}

type CreatePageWithCookie = {
    browser: Browser;
    token: string;
    cookie: Protocol.Network.Cookie[];
    url: string;
}
