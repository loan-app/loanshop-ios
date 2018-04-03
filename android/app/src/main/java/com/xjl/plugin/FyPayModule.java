package com.xjl.plugin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.fuiou.mobile.FyPay;
import com.fuiou.mobile.FyPayCallBack;
import com.fuiou.mobile.bean.MchantMsgBean;

/**
 * Created by gerow on 2017/9/28.
 */

public class FyPayModule extends ReactContextBaseJavaModule {

    protected Callback callback;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        }
    };

    public FyPayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "FyPay";
    }

    @ReactMethod
    public void pay(final ReadableMap options, final Callback callback) {
        this.callback = callback;
        MchantMsgBean bean = new MchantMsgBean();
        bean.setOrderId(options.getString("MCHNTORDERID"));
        bean.setKey("i941pumycj5li4kcre385clb3572v7uv");
        bean.setMchntCd(options.getString("MCHNTCD"));
        bean.setAmt(options.getString("AMT"));
        bean.setUserId(options.getString("USERID"));
        bean.setCardNo(options.getString("BANKCARD"));
        bean.setIDcardType(options.getString("IDTYPE"));
        bean.setIDNo(options.getString("IDNO"));
        bean.setUserName(options.getString("NAME"));
        bean.setBackUrl(options.getString("BACKURL"));
        bean.setPayType("mobilePay");

        Activity currentActivity = getCurrentActivity();
        FyPay.pay(currentActivity, bean,
                new FyPayCallBack() {

                    @Override
                    public void onPayComplete(String arg0,
                                              String arg1, Bundle arg2) {
                        Log.i(arg0, arg1);
                        if (!"0001".equals(arg0)) {
                            callback.invoke("充值失败，Msg：" + arg1 + "，Code：" + arg0);
                        } else {
                            callback.invoke("");
                        }
                    }

                    @Override
                    public void onPayBackMessage(
                            String paramString) {
                        Log.i("-----", paramString);
                        callback.invoke(paramString);
                    }
                });
    }
}
