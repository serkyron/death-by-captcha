import {SocketClient} from './vendor_api/deathbycaptcha'
import {IRecaptchaV2Params} from "./interfaces/IRecaptchaV2Params";
import {IRecaptchaV2Response} from "./interfaces/IRecaptchaV2Response";
import {DbcSocketClient} from "./vendor_api/client";

export class RecapchaV2Solver {

    private client: DbcSocketClient;

    constructor(username: string, password: string) {
        this.client = new SocketClient(username, password);
    }

    public solve(params: IRecaptchaV2Params): Promise<IRecaptchaV2Response> {
        const token_params = JSON.stringify({
            'proxy': params.proxy,
            'proxytype': params.proxyType,
            'googlekey': params.googleKey,
            'pageurl': params.pageUrl,
        });

        return new Promise<IRecaptchaV2Response>((resolve, reject) => {
            this.client.decode({extra: {type: 4, token_params: token_params}}, (captcha) => {
                if (captcha) {
                    resolve({
                        captchaId: captcha["captcha"],
                        token: captcha['text'],
                    });
                    return;
                }

                reject("Failed to solve captcha, supplied params might be wrong. No details from the service");
            });
        });
    }

    public report(captchaId: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client.report(captchaId, (result) => {
                if (result) {
                    resolve(result);
                    return;
                }

                reject();
            });
        });
    }
}
