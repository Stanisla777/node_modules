export declare enum AuthQREvents {
    /**
     * Событие сканирования qr-кода. Вызывается, когда пользователь увидел окно подтверждения входа на мобильном устройстве.
     */
    SCANNED = "VKSDKQRScaned",
    /**
     * Событие клика по qr-коду. Вызывается, когда пользователь нажал на иконку увеличения qr-кода.
     */
    CLICKED = "VKSDKQRClicked"
}