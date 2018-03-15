package com.xjl.plugin;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by gerow on 2017/9/28.
 */

public class XStatusBarModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public XStatusBarModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNStatusBar";
    }

    @ReactMethod
    public void setDark() {
        Helper.statusBarLightMode(getCurrentActivity());
    }
}
