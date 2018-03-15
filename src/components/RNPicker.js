import Picker from 'react-native-picker';

const defaultOptions = {
  pickerConfirmBtnText: '确认',
  pickerCancelBtnText: '取消',
  pickerTitleText: '',
  pickerTitleColor: [136,136,136, 1],
  pickerToolBarBg: [245,245,245, 1],
  pickerConfirmBtnColor: [24,142,238, 1],
  pickerCancelBtnColor: [24,142,238, 1],
  pickerBg: [255,255,255, 1],
  pickerFontColor: [51,51,51, 1],
  pickerData: [],
  selectedValue: [],
  onPickerConfirm: () => {},
  onPickerCancel: () => {},
  onPickerSelect: () => {}
};

export default {
  init: function (options) {
    options.pickerData = Array.isArray(options.pickerData) && options.pickerData.length ? options.pickerData : [''];
    Picker.init(Object.assign({}, defaultOptions, options || {}));
  },
  toggle: () => {
    Picker.toggle();
  },
  show: () => {
    Picker.show();
  },
  hide: () => {
    Picker.hide();
  },
  select: (valueArr, callback) => {
    Picker.select(valueArr, callback);
  },
  isPickerShow: () => {
    return Picker.isPickerShow();
  }
};
