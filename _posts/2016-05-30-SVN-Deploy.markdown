---
layout: post
title: "Ubuntu下搭建SVN服务器"
---

由于工作需要，需要在一台Ubuntu机器上搭建SVN服务器，看了网上的教程，感觉写得都有点乱。现在搞定之后总结一下

## 安装 ##
{% highlight shell %}
sudo apt-get install subversion
{% endhighlight %}

## 创建svn代码库 ##
{% highlight shell %}
svnadmin create xxx
{% endhighlight %}

## 配置 ##
#### ```\conf\svnserve.conf``` ####
取消以下四条的注释
{% highlight shell %}
password-db = passwd.conf（确定密码存储文件）
anon-access = read（匿名访问权限，不允许则变为none）
auth-access = write（写权限）
authz-db = authz.conf（权限配置文件）
{% endhighlight %}

#### ```\conf\authz.conf``` ####
##### 配置用户组
{% highlight shell %}
[group]
group1 = person1,person2,person3
group2 = person4,person5
{% endhighlight %}

##### 配置目录权限
{% highlight shell %}
[/]
* = r     #这一条一定要放在下一条之上，不然会报错
@group1 = rw

[/dir1]
@group1 = rw
@group2 = rw

[/dir2]
@group1 = r
{% endhighlight %}

#### ```\conf\passwd``` ####
{% highlight shell %}
person1 = pw1
person2 = pw2
person3 = pw3
person4 = pw4
person5 = pw5
{% endhighlight %}

## 启动/停止 ##
启动服务器 ```svnserve -d -r /var/svn/xxx```
停止服务器 ```ps -ef |grep svn``` 找到之后kill掉就可以

