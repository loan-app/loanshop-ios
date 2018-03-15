package com.xjl.plugin;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.baidu.mobstat.StatService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by gerow on 2017/9/28.
 */

public class ChannelModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public ChannelModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNChannel";
    }

    @ReactMethod
    public void startCount(String name) {
        StatService.onPageStart(this.reactContext,name);
    }

    @ReactMethod
    public void stopCount(String name) {
        StatService.onPageEnd(this.reactContext,name);
    }

    @Override
    public @Nullable Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();

        PackageManager packageManager = this.reactContext.getPackageManager();
        try {
            ApplicationInfo appInfo = this.reactContext.getPackageManager()
                    .getApplicationInfo(this.reactContext.getPackageName(),
                            PackageManager.GET_META_DATA);
            constants.put("channel", appInfo.metaData.getString("BaiduMobAd_CHANNEL"));
        } catch (PackageManager.NameNotFoundException e) {
            Log.e("111",e.getMessage());
            constants.put("channel", "test2");
        }
        return constants;
    }
}
