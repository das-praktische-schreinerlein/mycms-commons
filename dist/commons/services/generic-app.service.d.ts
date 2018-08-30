import { Subject } from 'rxjs/Subject';
export declare enum AppState {
    Starting = 1,
    Ready = 5,
    Failed = 10,
}
export declare enum AppOnlineState {
    Online = 1,
    Offline = 2,
}
export declare enum BrowserOnlineState {
    Online = 1,
    Offline = 2,
}
export declare abstract class GenericAppService {
    static ERROR_APP_NOT_INITIALIZED: string;
    private appState;
    private appStateObservable;
    private appOnlineStateObservable;
    private browserOnlineStateObservable;
    constructor();
    abstract initApp(): void;
    abstract doSwitchToOfflineVersion(): void;
    abstract doSwitchToOnlineVersion(): void;
    getAppState(): Subject<AppState>;
    getAppOnlineState(): Subject<AppOnlineState>;
    getBrowserOnlineState(): Subject<BrowserOnlineState>;
    abstract getAppConfig(): {};
    protected setAppState(appState: AppState): void;
    protected initBrowserOnlineStateLoader(): void;
}
