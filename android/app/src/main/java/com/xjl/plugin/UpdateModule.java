package com.xjl.plugin;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONObject;

import ezy.boost.update.IUpdateParser;
import ezy.boost.update.UpdateInfo;
import ezy.boost.update.UpdateManager;
import ezy.boost.update.UpdateUtil;

/**
 * Created by gerow on 2017/9/28.
 */

public class UpdateModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public UpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNUpdate";
    }

    @ReactMethod
    public void autoUpdate(final String updateUrl, final String uplodaUrl) {
        UpdateManager.create(reactContext.getCurrentActivity()).setUrl(updateUrl).setParser(new IUpdateParser() {
            @Override
            public UpdateInfo parse(String source) throws Exception {
                UpdateInfo info = new UpdateInfo();
                JSONObject o = new JSONObject(source);
                if (o.has("data")) {
                    o = o.getJSONObject("data");
                }
                int version = UpdateUtil.getVersionCode(reactContext);
//                info.versionCode=v;
                info.versionCode = o.optInt("version", 0);
                info.hasUpdate = info.versionCode > version;
                Log.e("update-----", o.toString());
                if (!info.hasUpdate) {
                    return info;
                }
                if (o.optString("isForce") == "1") {
                    info.isForce = true;
                }
//                info.isForce=isF;

                info.versionName = o.optString("versionName");
                info.updateContent = o.optString("des");

                info.md5 = info.versionCode + "d12a3ad91c23";
                info.url = uplodaUrl;
                return info;
            }
        }).check();
//        UpdateManager.install(reactContext);
    }

    @ReactMethod
    public void checkUpdate() {
        UpdateManager.checkManual(reactContext);
    }

}
