// Version 1.0.3

const maxConfigItems = 500
const maxPerType = 200
const includeOriginalConfigs = false

const subLinks = [
    "https://raw.githubusercontent.com/freefq/free/master/v2",
    "https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub",
    "https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2",
    "https://raw.githubusercontent.com/AzadNetCH/Clash/main/V2Ray.txt"
]
const cnfLinks = [
    "https://raw.githubusercontent.com/mahdibland/ShadowsocksAggregator/master/sub/sub_merge.txt",
    "https://raw.githubusercontent.com/awesome-vpn/awesome-vpn/master/all"
]

const addressList = ["discord.com", "cloudflare.com", "nginx.com", "cdnjs.com", "vimeo.com", "networksolutions.com", "spotify.com"]
const fpList = ["chrome", "chrome", "chrome", "firefox", "safari", "edge", "ios", "android", "random", "random"]
const alpnList = ["http/1.1", "h2,http/1.1", "h2,http/1.1"]
var cleanIPs = ['93.114.65.102',
		'159.112.235.178',
		'103.11.212.39',
		'203.24.103.231',
		'170.114.45.109',
		'194.53.53.129',
		'199.181.197.146',
		'185.170.166.91',
		'103.172.111.96',
		'170.114.45.109',
		'199.212.90.87',
		'203.29.55.155',
		'103.160.204.254',
		'185.18.250.168',
		'203.13.32.65',
		'199.212.90.87',
		'199.212.90.53',
		'194.53.53.129',
		'203.24.103.231',
		'91.195.110.203',
		'199.212.90.87',
		'194.53.53.129',
		'103.160.204.18',
		'195.85.59.14',
		'185.176.24.187',
		'203.24.103.231',
		'185.18.250.168',
		'199.181.197.146',
		'185.174.138.65',
		'185.176.24.187',
		'91.195.110.203',
		'199.212.90.53',
		'185.18.250.168',
		'185.170.166.91',
		'185.176.24.187',
		'193.9.49.168',
		'212.24.127.147',
		'103.160.204.254',
		'194.36.55.196',
		'203.13.32.65',
		'93.114.65.8',
		'170.114.45.109',
		'103.160.204.18',
		'66.81.247.86',
		'199.212.90.87',
		'103.160.204.18',
		'185.162.229.198',
		'103.160.204.254',
		'193.9.49.168',
		'103.160.204.18',
		'185.176.24.187',
		'93.114.65.8',
		'212.24.127.147',
		'194.36.55.196',
		'188.42.89.205',
		'199.212.90.53',
		'103.172.111.96',
		'91.195.110.61',
		'185.176.24.187',
		'93.114.65.8',
		'91.195.110.203',
		'170.114.45.109',
		'199.212.90.87',
		'199.212.90.53',
		'103.172.111.96',
		'203.29.55.155',
		'66.81.247.86',
		'93.114.65.102',
		'203.13.32.65',
		'185.176.24.187',
		'203.24.103.231',
		'212.24.127.147',
		'195.85.59.14',
		'159.112.235.178',
		'159.112.235.178',
		'185.176.24.187',
		'188.42.89.205',
		'185.174.138.65',
		'103.160.204.18',
		'156.238.18.70',
		'212.24.127.147',
		'185.18.250.168',
		'203.24.103.231',
		'199.212.90.87',
		'103.160.204.254',
		'66.81.247.86',
		'185.170.166.91',
		'66.81.247.86',
		'91.195.110.61',
		'156.238.18.70',
		'212.24.127.147',
		'103.172.111.96',
		'185.18.250.168',
		'185.176.24.187',
		'203.13.32.65',
		'203.24.103.231',
		'199.212.90.87',
		'103.160.204.254',
		'199.212.90.87',
		'93.114.65.8']

export default {
    async fetch(request) {
    var url = new URL(request.url)
    var pathParts = url.pathname.replace(/^\/|\/$/g, "").split("/")
    var type = pathParts[0].toLowerCase()
    if (["sub", "clash"].includes(type)) {

        var configList = []
        for (var subLink of subLinks) {
        try {
            configList = configList.concat(await fetch(subLink).then(r => r.text()).then(a => atob(a)).then(t => t.split("\n")))
        } catch (e) { }
        }
        for (var cnfLink of cnfLinks) {
        try {
            configList = configList.concat(await fetch(cnfLink).then(r => r.text()).then(t => t.split("\n")))
        } catch (e) { }
        }
        
        var vmessConfigList = configList.filter(cnf => (cnf.search("vmess://") == 0))
        var trojanConfigList = configList.filter(cnf => (cnf.search("trojan://") == 0))
        var ssConfigList = configList.filter(cnf => (cnf.search("ss://") == 0))
        var mergedConfigList = []
        
        if (type == "sub") {
        if (includeOriginalConfigs) {
            mergedConfigList = mergedConfigList.concat(getMultipleRandomElements(vmessConfigList, maxPerType))
        }
        mergedConfigList = mergedConfigList.concat(
            getMultipleRandomElements(
            vmessConfigList.map(decodeVmess).map(cnf => mixConfig(cnf, url, "vmess")).filter(cnf => (!!cnf && cnf.id)).map(encodeVmess).filter(cnf => !!cnf),
            maxPerType
            )
        )

        if (includeOriginalConfigs) {
            mergedConfigList = mergedConfigList.concat(getMultipleRandomElements(trojanConfigList, maxPerType))
            mergedConfigList = mergedConfigList.concat(getMultipleRandomElements(ssConfigList, maxPerType))
        }

        return new Response(btoa(getMultipleRandomElements(mergedConfigList, maxConfigItems).join("\n")));
        } else { // clash
        if (includeOriginalConfigs) {
            mergedConfigList = mergedConfigList.concat(
            getMultipleRandomElements(
                vmessConfigList.map(decodeVmess).filter(cnf => (cnf && cnf.id)).map(cnf => toClash(cnf, "vmess")).filter(cnf => (cnf && cnf.uuid)),
                maxPerType
            )
            )
        }
        mergedConfigList = mergedConfigList.concat(
            getMultipleRandomElements(
            vmessConfigList.map(decodeVmess).map(cnf => mixConfig(cnf, url, "vmess")).filter(cnf => (cnf && cnf.id)).map(cnf => toClash(cnf, "vmess")),
            maxPerType
            )
        )
        return new Response(toYaml(mergedConfigList));
        }
    } else {
        var url = new URL(request.url)
        var newUrl = new URL("https://" + url.pathname.replace(/^/|/$/g, ""))
        return fetch(new Request(newUrl, request));
    }
    }
}

function encodeVmess(conf) {
    try {
    return "vmess://" + btoa(JSON.stringify(conf))
    } catch {
    return null
    }
}

function decodeVmess(conf) {
    try {
    return JSON.parse(atob(conf.substr(8)))
    } catch {
    return {}
    }
}

function mixConfig(conf, url, protocol) {
    try {
    if (conf.tls != "tls") {
        return {}
    }
    var addr = conf.sni
    if (!addr) {
        if (conf.add && !isIp(conf.add)) {
        addr = conf.add
        } else if (conf.host && !isIp(conf.host)) {
        addr = conf.host
        }
    }
    if (!addr) {
        return conf
    }
    conf.name = (conf.name ? conf.name : conf.ps) + '-Worker'
    conf.sni = url.hostname
    if (cleanIPs.length) {
        conf.add = cleanIPs[Math.floor(Math.random() * cleanIPs.length)]
    } else {
        conf.add = addressList[Math.floor(Math.random() * addressList.length)]
    }
    
    if (protocol == "vmess") {
        conf.sni = url.hostname
        conf.host = url.hostname
        if (conf.path == undefined) {
        conf.path = ""
        }
        conf.path = "/" + addr + ":" + conf.port + "/" + conf.path.replace(/^\//g, "")
        conf.fp = fpList[Math.floor(Math.random() * fpList.length)]
        conf.alpn = alpnList[Math.floor(Math.random() * alpnList.length)]
        conf.port = 443
    }
    return conf
    } catch (e) {
    return {}
    }
}

function getMultipleRandomElements(arr, num) {
    var shuffled = arr //[...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, num)
}

function isIp(str) {
    try {
    if (str == "" || str == undefined) return false
    if (!/^(\d{1,2}|1\d\d|2[0-4]d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(str)) {
        return false
    }
    var ls = str.split('.')
    if (ls == null || ls.length != 4 || ls[3] == "0" || parseInt(ls[3]) === 0) {
        return false
    }
    return true
    } catch (e) { }
    return false
}

function toClash(conf, protocol) {
    const regexUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    var config = {}
    try {
    config = {
        name: conf.name ? conf.name : conf.ps,
        type: protocol,
        server: conf.add,
        port: conf.port,
        uuid: conf.id,
        alterId: 0,
        tls: true,
        cipher: conf.cipher ? conf.cipher : "auto",
        "skip-cert-verify": true,
        servername: conf.sni,
        network: conf.net,
        "ws-opts": {
        path: conf.path,
        headers: {
            host: conf.host
        }
        }
    }
    config.name = config.name.replace(/[^\x20-\x7E]/g, "").replace(/[\s\/:|\[\]@\(\)\.]/g, "") + "-" + Math.floor(Math.random() * 10000)
    if (!regexUUID.test(config.uuid)) {
        return {}
    }
    return config
    } catch (e) {
    return {}
    }
}

function toYaml(configList) {
    var yaml = 
`
mixed-port: 7890
allow-lan: true
log-level: info
external-controller: 0.0.0.0:9090
dns:
    enabled: true
    nameserver:
    - 1.1.1.1
    - 4.2.2.4
    - 119.29.29.29
    - 223.5.5.5
    fallback:
    - 8.8.8.8
    - 8.8.4.4
    - tls://1.0.0.1:853
    - tls://dns.google:853

proxies:
${configList.map(cnf => "  - " + JSON.stringify(cnf)).join("\n")}

proxy-groups:
    - name: maingroup
    type: url-test
    tolerance: 300
    url: 'https://www.google.com/generate_204'
    interval: 30
    lazy: false
    proxies:
${configList.map(cnf => "      - " + cnf.name.trim()).join("\n")}

rules:
    - GEOIP,IR,DIRECT
    - MATCH,maingroup

`
return yaml;
}
