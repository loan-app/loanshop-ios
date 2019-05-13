package com.cz018.v1;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.baidu.mobstat.StatService;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.fuiou.mobile.FyPay;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.cz018.v1.BuildConfig;
import com.cz018.v1.R;
import com.theweflex.react.WeChatPackage;
import com.xjl.plugin.ChannelPackage;
import com.xjl.plugin.FyPayPackage;
import com.xjl.plugin.TDPackage;
import com.xjl.plugin.UpdatePackage;
import com.xjl.plugin.XStatusBarPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new WeChatPackage(),
                    new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                    new RNDeviceInfo(),
                    new FyPayPackage(),
                    new ChannelPackage(),
                    new TDPackage(),
                    new UpdatePackage(),
                    new XStatusBarPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        FyPay.setDev(true);
        FyPay.init(this);
//        StatService.setDebugOn(true);
        ApplicationInfo appInfo = null;
        try {
            appInfo = this.getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        String channelStr = appInfo.metaData.getString("BaiduMobAd_CHANNEL");

        Log.d("------channelStr=", channelStr);

        StatService.setAppChannel(this, channelStr, false);
    }
}
