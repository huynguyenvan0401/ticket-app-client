import devConf from './dev';
import prodConf from './prod';

type Key = {
	BASE_URL?: string;
};

let keys: Key = {};

if (process.env.NODE_ENV === 'production') {
	keys = prodConf;
} else {
	keys = devConf;
}

export default keys;
