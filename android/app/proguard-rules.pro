# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native and general optimization rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }
-keep class expo.modules.** { *; }
-keep class com.airbnb.android.react.lottie.** { *; }
-keep class com.google.firebase.** { *; }
-keep class io.invertase.firebase.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.proguard.annotations.DoNotStrip { *; }
-keep class com.facebook.proguard.annotations.KeepGettersAndSetters { *; }
-keep class com.facebook.proguard.annotations.KeepName { *; }
-keepclassmembers class * {
	@com.facebook.proguard.annotations.DoNotStrip *;
}
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
-dontwarn com.facebook.jni.**
-dontwarn com.swmansion.reanimated.**
-dontwarn com.swmansion.gesturehandler.**
-dontwarn expo.modules.**
-dontwarn com.airbnb.android.react.lottie.**
-dontwarn com.google.firebase.**
-dontwarn io.invertase.firebase.**
-dontwarn com.facebook.soloader.**

# Remove logging
-assumenosideeffects class android.util.Log {
	public static *** d(...);
	public static *** v(...);
	public static *** i(...);
	public static *** w(...);
	public static *** e(...);
}

# Optimization
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*
