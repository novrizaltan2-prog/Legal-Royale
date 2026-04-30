package com.legalroyale.game;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.*;
import android.view.View;
import android.view.WindowManager;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint({"SetJavaScriptEnabled", "WrongConstant"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // KRITIS: Full screen tanpa status bar
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        // Cegah layar mati saat bermain
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // WebView sebagai root view (tanpa layout XML — lebih bersih)
        webView = new WebView(this);
        setContentView(webView);

        // ---- Pengaturan WebView ----
        WebSettings settings = webView.getSettings();

        settings.setJavaScriptEnabled(true);           // WAJIB untuk game JS
        settings.setDomStorageEnabled(true);           // LocalStorage & SessionStorage
        settings.setAllowFileAccess(true);             // Akses file assets/
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false); // KRITIS: izinkan autoplay audio
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);                // Nonaktifkan zoom (seperti game)
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);                     // Cegah perubahan ukuran teks sistem

        // ---- Nonaktifkan pull-to-refresh & overscroll ----
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        // CSS overscroll-behavior: none sudah menangani ini dari sisi web
        // Baris di atas adalah pengaman di sisi native

        // ---- Chrome Client untuk izin media ----
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Izinkan audio tanpa dialog permission
                request.grant(request.getResources());
            }
        });

        // ---- WebViewClient: cegah link terbuka di browser ----
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return false; // Tangani semua URL di dalam WebView
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req,
                                         WebResourceError error) {
                // Log error — jangan crash
                android.util.Log.e("LegalRoyale",
                    "WebView error: " + error.getErrorCode()
                    + " " + error.getDescription());
            }
        });

        // ---- Load game dari assets ----
        // File ada di: app/src/main/assets/index.html
        webView.loadUrl("file:///android_asset/index.html");
    }

    // ---- Tombol Back Android ----
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // ---- Pause/Resume audio saat app background ----
    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
        webView.pauseTimers();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
        webView.resumeTimers();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        webView.destroy();
    }
}