import {User} from './user';
import {Action} from './action';

export interface Message {
    from?: User;
    content?: any;
    time?: any;
    action?: Action;
}
