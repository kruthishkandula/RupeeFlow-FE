package com.rupeeflow

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class NativeLocalStorageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private val reactApplicationContext: ReactApplicationContext = reactContext
    private val prefs: SharedPreferences by lazy {
        reactApplicationContext.getSharedPreferences("local_storage", Context.MODE_PRIVATE)
    }
    
    override fun getName(): String = "NativeLocalStorage"

    @ReactMethod
    fun setItem(key: String, value: String) {
        prefs.edit().putString(key, value).apply()
    }

    @ReactMethod
    fun getItem(key: String, promise: Promise) {
        promise.resolve(prefs.getString(key, null))
    }

    @ReactMethod
    fun removeItem(key: String) {
        prefs.edit().remove(key).apply()
    }

    @ReactMethod
    fun clear() {
        prefs.edit().clear().apply()
    }
}
