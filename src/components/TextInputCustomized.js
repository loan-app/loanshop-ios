import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  Text
} from 'react-native';
import Touchable from './Touchable';
import imgs from '../resources/imgs';
import formStyles from '../styles/formStyles';
import globalStyles from '../styles/global';

const emptyFunc = () => {
};

class TextInputCustomized extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
    this._onFocus = () => {
      this.setState({isFocused: true});
    };

    this._onBlur = () => {
      this.props.onBlur();
      this.setState({isFocused: false});
    };
  }

  componentDidMount() {
    this.props.onDidMount();
    if (this.props.focusOnDidMount) {
      this.input.focus();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.flag !== this.props.flag || nextProps.placeholder !== this.props.placeholder || nextProps.value !== this.props.value || this.state.isFocused !== nextState.isFocused;

  }

  render() {
    let icon = this.props.icon || null,
      inputIcon = this.props.inputIcon,
      label = this.props.label,
      rightLabel = this.props.rightLabel,
      labelStyle = {color: '#333333', fontSize: 15};
    if (this.props.labelWidth) {
      labelStyle.width = this.props.labelWidth;
    }
    let clearBtnStyle = this.props.value && this.state.isFocused ? formStyles.clearTextBtn : formStyles.hideClearBtn;
    return (
      <View
        style={[formStyles.formControl, this.props.style, this.props.multiline && formStyles.multiline, this.props.borderBottom && formStyles.borderBottom]}>
        { icon ? icon : ( label ? <Text style={labelStyle}>{label}</Text> : null)}
        <View style={[formStyles.textInputWrapper, this.props.textInputWrapper, {paddingLeft: inputIcon ? 30 : 0}]}>
          {
            inputIcon ? (
              <View style={formStyles.inputIconWrapper}>
                {inputIcon}
              </View>
            ) : null
          }
          <TextInput
            ref={ref => {
              this.input = ref;
            }}
            keyboardType={this.props.keyboardType || 'default'}
            placeholderTextColor={this.props.holderColor||"#999999"}
            secureTextEntry={this.props.secureTextEntry}
            style={[formStyles.textInput, this.props.textInputStyle, this.props.multiline && formStyles.multilineInput]}
            multiline={this.props.multiline}
            onChangeText={this.props.onChangeText}
            placeholder={this.props.placeholder}
            underlineColorAndroid='transparent'
            onBlur={this._onBlur}
            onFocus={this._onFocus}
            autoFocus={this.props.autoFocus || false}
            value={this.props.value ? this.props.value + '' : ''}/>
          {!this.props.multiline && !this.props.hideClear && <Touchable
            style={[clearBtnStyle, this.props.cleanStyle]}
            feedback={true}
            onPress={this.props.onClear}>
            <View style={globalStyles.directionRow}>
              { imgs.inputClear(formStyles.clearTextIcon)}
            </View>
          </Touchable>}
        </View>
        { typeof rightLabel === "string" ? <Text>{rightLabel}</Text> : rightLabel }
      </View>
    );
  }
}

TextInputCustomized.defaultProps = {
  secureTextEntry: false,
  multiline: false,
  onChangeText: emptyFunc,
  onBlur: emptyFunc,
  onClear: emptyFunc,
  onDidMount: emptyFunc,
  keyboardType: 'default',
  focusOnDidMount: false,
  hideClear: false
};

TextInputCustomized.propTypes = {
  focusOnDidMount: PropTypes.bool.isRequired,
  textInputStyle: PropTypes.any,
  label: PropTypes.string,
  labelWidth: PropTypes.number,
  rightLabel: PropTypes.any,
  style: PropTypes.any,
  icon: PropTypes.any,
  inputIcon: PropTypes.any,
  multiline: PropTypes.bool,
  onChangeText: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDidMount: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  keyboardType: PropTypes.string,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool
};

export default TextInputCustomized;
