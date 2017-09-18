import originJSONP from 'jsonp';

export default function(url, data, option) {
  url += ( url.indexOf('?') < 0 ? '?' : '&' ) + param(data);
  return new Promise((resolve,reject) => {
    originJSONP(url, option, (error, data) => {
      if(!error){
        resolve(data);
      }else{
        reject(error);
      }
    });
  });
};

function param(data) {
  let url = '';
  for(let key in data){
    let value = data[key] === undefined ? '' : data[key];
    url += `&${key}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
};
