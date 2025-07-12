console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
document.addEventListener('DOMContentLoaded', function() {
    // 选择所有a标签
    const links = document.querySelectorAll('a');
    
    // 为每个链接添加点击事件监听器
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认行为
            e.preventDefault();
            
            // 获取链接地址
            const href = this.getAttribute('href');
            
            // 检查是否有href属性
            if (href) {
                // 使用InAppBrowser或其他方式打开链接
                if (window.cordova && window.cordova.InAppBrowser) {
                    // 如果是Cordova环境，使用InAppBrowser打开
                    cordova.InAppBrowser.open(href, '_system', 'location=yes');
                } else if (window.Android && typeof window.Android.openUrl === 'function') {
                    // 如果是Android自定义WebView，调用原生方法
                    window.Android.openUrl(href);
                } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openUrl) {
                    // 如果是iOS自定义WebView，调用原生方法
                    window.webkit.messageHandlers.openUrl.postMessage(href);
                } else {
                    // 普通浏览器环境，使用window.open
                    window.open(href, '_blank');
                }
            }
        });
    });
});