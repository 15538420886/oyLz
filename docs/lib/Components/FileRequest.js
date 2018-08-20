var Utils = require('../../public/script/utils');

function getError(option, xhr) {
	const msg = `cannot post ${option.action} ${xhr.status}'`;
	const err = new Error(msg);
	err.status = xhr.status;
	err.method = 'post';
	err.url = option.action;
	return err;
}

function getBody(xhr) {
	const text = xhr.responseText || xhr.response;
	if (!text) {
		return text;
	}

	try {
		return JSON.parse(text);
	} catch (e) {
		return text;
	}
}

// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
// }
export default function FileRequest(option) {
	const xhr = new XMLHttpRequest();

	if (option.onProgress && xhr.upload) {
		xhr.upload.onprogress = function progress(e) {
			if (e.total > 0) {
				e.percent = e.loaded / e.total * 100;
			}
			
			option.onProgress(e);
		};
	}

	const formData = new FormData();

	if (option.data) {
		var req = {
			flowNo:'0',
			object:option.data.body
		};
		
        formData.append('reqObject', JSON.stringify(req));
	}

	formData.append(option.filename, option.file);

	xhr.onerror = function error(e) {
		option.onError(e);
	};

	xhr.onload = function onload() {
		// allow success when 2xx status
		// see https://github.com/react-component/upload/issues/34
		if (xhr.status < 200 || xhr.status >= 300) {
			return option.onError(getError(option, xhr), getBody(xhr));
		}

		var res = getBody(xhr);
		option.onSuccess( res );
		
		var callback = option.data.callback;
		if(callback !== null && typeof(callback) !== 'undefined'){
			callback(res);
		}
	};

	var sid = Utils.getSessionID();
	if( sid !== '' ){
		Utils.fz_setCookie('SESSION', sid, 1);
	}
	
	xhr.open('post', option.action, true);
	xhr.withCredentials = true;
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	
	xhr.send(formData);

	return {
		abort() {
			xhr.abort();
		},
	};
}
