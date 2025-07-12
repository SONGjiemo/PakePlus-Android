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
/**
 * 唤醒第三方网盘App的工具函数
 * @param {string} app - 应用名称: 'baidu' | 'thunder' | 'uc' | 'quark'
 */
function checkAndWakeApp(app) {
  // 定义各网盘的Scheme和安卓下载链接
  const appConfig = {
    baidu: {
      scheme: 'baiduyun://',
      downloadUrl: 'https://sj.qq.com/myapp/detail.htm?apkName=com.baidu.netdisk'
    },
    thunder: {
      scheme: 'thunder://',
      downloadUrl: 'https://sj.qq.com/myapp/detail.htm?apkName=com.xunlei.downloadprovider'
    },
    uc: {
      scheme: 'ucbrowser://',
      downloadUrl: 'https://sj.qq.com/myapp/detail.htm?apkName=com.UCMobile'
    },
    quark: {
      scheme: 'quark://',
      downloadUrl: 'https://sj.qq.com/myapp/detail.htm?apkName=com.quark.browser' // 夸克浏览器（含网盘功能）
    }
  };

  // 获取对应应用的配置
  const config = appConfig[app];
  if (!config) {
    console.error('不支持的应用类型');
    return;
  }

  // 创建隐藏的iframe尝试唤醒
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = config.scheme;
  document.body.appendChild(iframe);

  // 记录点击时间
  const startTime = Date.now();

  // 监听页面是否隐藏（App唤醒成功会切换到后台）
  const visibilityChangeHandler = () => {
    if (document.hidden) {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      return;
    }
  };
  document.addEventListener('visibilitychange', visibilityChangeHandler);

  // 2秒后检查是否唤醒成功
  setTimeout(() => {
    document.body.removeChild(iframe);
    
    // 如果时间差很短，说明App未安装
    if (Date.now() - startTime < 3000) {
      window.location.href = config.downloadUrl;
    }
  }, 2000);
}