import {
  AsyncStorage
} from 'react-native';

export default function LocalStorage(keyPrefix) {
  this._keyPrefix = keyPrefix || 'LOCAL_STORAGE@'
}

LocalStorage.prototype = {
  _getStorageKey: key => this._keyPrefix + key,

  setItem: function (key, data) {
    AsyncStorage.setItem(this._getStorageKey(key), JSON.stringify(data));
  },

  getItem: function (key, success, failure) {
    AsyncStorage.getItem(this._getStorageKey(key), (err, data) => {
      if(err && typeof failure === 'function'){
        failure(err)
      }else if(typeof success === 'function'){
        success(JSON.parse(data));
      }
    })
  },

  removeItem: function (key, cb) {
    cb = typeof cb === 'function' ? cb : () => {};
    AsyncStorage.removeItem(this._getStorageKey(key), cb);
  },

  multiGet: function (keys, success, failure) {
    let storageKeys = keys.map(key => this._getStorageKey(key));
    AsyncStorage.multiGet(storageKeys, (err, dataArr) => {
      if(!err){
        let composedData = {};
        dataArr.forEach((data, index) => {
          composedData[keys[index]] = JSON.parse(data[1]);
        });
        if(typeof success === 'function'){
          success(composedData);
        }
      }else if(typeof failure === 'function'){
        failure(err);
      }
    });
  },
  multiSet: function (keyValueMap) {
    let keys = Object.keys(keyValueMap);
    let multi_set_pairs = keys.map(key => [key, JSON.stringify(keyValueMap[key])]);
    AsyncStorage.multiSet(multi_set_pairs);
  }
};
