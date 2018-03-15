import React, {Component} from 'react';
import styled from 'styled-components/native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  ScrollLayout,
  StyledText,
  ActivityIndicatorModal
} from '../components/UtilLib';
import Touchable from '../components/Touchable';

import * as bankListCreator from '../actions/bankListActions';

const ItemButton = styled(Touchable)`
  margin-top:10;
  padding-left:15;
  background-color:#ffffff;
  height:51;
  flex-direction:row;
  align-items:center;
`;
const Image = styled.Image`
   margin-right:10;
   margin-top:10;
   align-self:flex-start;
   width:18;
   height:18;
`;
const View = styled.View`

`;

class BankList extends Component {

  static navigationOptions = ({navigation, screenProps}) => ({
    title: (navigation.state.params && navigation.state.params.onSelect ? '选择银行' : '限额说明')
  });

  constructor(props) {
    super(props);
  }

  _selectBank(item) {
    const {state, goBack} = this.props.navigation;
    if (state.params && state.params.onSelect) {
      state.params.onSelect({name: item.name, code: item.id});
      goBack();
    }
  }

  componentDidMount() {
    !this.props.list && this.props.bankListActions.getData(true);
  }

  render() {
    let {loading, list} = this.props;
    return (
      <ScrollLayout color="transparent">
        {
          list && list.map((item, i) => {
            return (
              <ItemButton key={i} onPress={this._selectBank.bind(this, item)}
                          feedback={(this.props.navigation.state.params && this.props.navigation.state.params.onSelect) ? true : false}>
                {item.icon && <Image source={{uri: item.icon}}/>}
                <View>
                  <StyledText color="#333333" size="14">{item.name}</StyledText>
                  <StyledText color="#999999" size="12">
                    单笔限额{item.singleLimit},日累计限额{item.dailyAccumulativeLimit},月累计限额{item.monthlyAccumulativeLimit}
                  </StyledText>
                </View>
              </ItemButton>
            )
          })
        }
        <View style={{height: 10}}/>
        <ActivityIndicatorModal visible={loading}/>
      </ScrollLayout>
    );
  }
}

const mapStateToProps = (state) => {
  const {loading, list} = state.bankList;
  return {loading, list};
};

const mapDispatchToProps = (dispatch) => {
  const bankListActions = bindActionCreators(bankListCreator, dispatch);
  return {bankListActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(BankList);