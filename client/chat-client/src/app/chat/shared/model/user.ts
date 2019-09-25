import {Settings} from "../../../settings/settings";

export interface User {
    id?: number;
    name?: string;
    avatar?: string;
    settings?: Settings;
}
