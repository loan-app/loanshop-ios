package com.xjl.plugin;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tendcloud.appcpa.TalkingDataAppCpa;

/**
 * Created by gerow on 2017/9/28.
 */

public class TDModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public TDModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNTD";
    }

    @ReactMethod
    public void init(String appId,String channelId) {
        TalkingDataAppCpa.init(reactContext,appId,channelId);
    }

    @ReactMethod
    public void onRegister(String name) {
        TalkingDataAppCpa.onRegister(name);
    }

    @ReactMethod
    public void onLogin(String name) {
        TalkingDataAppCpa.onLogin(name);
    }

    @ReactMethod
    public void onPay(String userId, String orderId , int amount , String payType) {
        TalkingDataAppCpa.onPay(userId, orderId ,amount,"CNY",payType);
    }
}
