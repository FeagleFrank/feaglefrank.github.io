---
layout: post
title: "抓取微信某公众号所有文章"
category: Python
---

## 思路 ##
先试了一下搜狗微信，发现无法查看该微信公众号的所有文章，因此考虑从微信PC/OS X版入手。

通过抓包，找到了微信PC版客户端打开微信公众号历史文章的地址，以及向下滑动到底部后的Ajax请求地址，但使用改地址直接在浏览器中访问，提示“请使用微信客户端中打开”，猜测可能是用了```user-agent```或```cookie```来进行校验。仔细观察后发现，该页面是由另一个页面redirect过来的，经验证，先请求该地址，获取cookie后，即可正常访问。分析Ajax请求的Request，带了```offset```参数与```count```参数，```count=10```，尝试了一下更改发现不起作用，```offeset```更改后生效，在Response中带了这篇文章的```title```，```datetime```等属性，并且很惊喜地发现了```content_url```中存了文章地址，可以正常打开访问

## 实现 ##
使用WireShark或者Fiddler进行抓包，需要获取两个地址：
公众号历史文章redirect前的地址，Like this：
>https://mp.weixin.qq.com/mp/getmasssendmsg?xxx

公众号历史文章页翻页Ajax请求地址，Like this：
>https://mp.weixin.qq.com/mp/profile_ext?xxx

使用urllib.request请求，并用cookieJar处理cookie，代码如下：
{% highlight python%}
def set_cookie(self, url):
	cookie = http.cookiejar.LWPCookieJar(self.cookie_filename)
	handler = urllib.request.HTTPCookieProcessor(cookie)
	opener = urllib.request.build_opener(handler)
	request = urllib.request.Request(url)
	response = opener.open(request)
	cookie.save(ignore_discard=True, ignore_expires=True)
{% endhighlight %}

携带之前获取的cookie，请求文章数据，更改offeset，直至获取到所有的文章数据
{% highlight python%}
def get_all_link(self, url_link):
	cookie = http.cookiejar.LWPCookieJar(self.cookie_filename)
	cookie.load(self.cookie_filename, ignore_discard=True, ignore_expires=True)
	handler = urllib.request.HTTPCookieProcessor(cookie)
	opener = urllib.request.build_opener(handler)
		
	while 1:
		print('offset:' + str(self.offset))
		url = re.sub("(?<=&offset=)(\d+)(?=&)", self.change_offset, url_link)
		request = urllib.request.Request(url)
		response = opener.open(request)
		data = json.loads(response.read().decode())
		articles = json.loads(data['general_msg_list'])['list']
		if not articles:
			break
		self.articles.extend(articles)
		self.offset += 10
		time.sleep(1)
{% endhighlight %}

最后使用pdfkit，将网页转换成pdf。一开始使用了```’pdfkit.from_url()```方法，发现所有的图片都丢失了。查看了一下文章详情页，发现图片都是js动态加上的，地址存储在img标签```data-src```中，所以先请求到网页源码，将```data-src```替换为```src```，再使用```pdfkit.from_string()```方法转为pdf。加上图片后访问较慢，就加了个多线程，代码如下：
{% highlight python%}
def html_to_pdf(self):
    for article in self.articles:
        t = article['comm_msg_info']['datetime']
        time_local = time.localtime(t)
        dt = time.strftime("%Y%m%d", time_local)
        title = article['app_msg_ext_info']['title']
        url = article['app_msg_ext_info']['content_url']
        print(url)
        # from_url会丢失图片
        # pdfkit.from_url(url, dt + '-' + title + '.pdf')
        response = urllib.request.urlopen(url)
        data = response.read().decode()
        data = data.replace('data-src', 'src')

        t = threading.Thread(target=self.get_pdf, args=(data, dt + '-' + title + '.pdf'))
        t.start()
        time.sleep(2)

def get_pdf(self, st, name):
    if os.path.exists(name):
        print('skip')
        return
    try:
        print(name)
        pdfkit.from_string(st, name)
    except:
        pass
{% endhighlight %}


## 结果 ##
抓了一个公众号，近两百篇文章，运行正常

[完整代码可访问这里](https://github.com/FeagleFrank/WeixinMPArticles)