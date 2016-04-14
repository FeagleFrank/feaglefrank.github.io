---
layout: post
title: "Hello Laravel"
subtitle: "初识PHP Laravel框架"
---

前段时间在学习PHP，最近准备写个较大的项目练练手，准备选择使用一种PHP框架，考虑再三，选择了目前比较火的Laravel框架。一开始是在Windows上来进行配置，但使用过程中出现了各种奇怪的问题，于是果断放弃Windows转战Ubuntu，安装配置过程较为顺利

## 安装 #

#### 安装apache、php、mysql，之前已经安装过了，所以略过

#### 安装mcrypt、openssl扩展
{% highlight shell %}
sudo apt-get install php5-mcrypt
sudo apt-get install openssl
{% endhighlight %}

#### 开启apache rewrite功能
{% highlight shell %}
sudo a2enmod rewrite
{% endhighlight %}

#### 安装Composer
{% highlight shell %}
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
{% endhighlight %}

#### 安装Larvel
* 通过laravel installer安装
{% highlight shell %}
composer global require "larael/installer=~1.1"
export PATH="~/.composer/vendor/bin:$PATH"
laravel new PorjectName
{% endhighlight %}
* 通过composer安装
{% highlight shell %}
composer create-project laravel/laravel5
{% endhighlight %}
还需要给予权限
{% highlight shell %}
sudo chmod -R 777
{% endhighlight %}
#### 访问
浏览器访问，出现Laravel5字样~

## 数据库&Model
用了PHP框架之后，才发现它带给我们的便利性。如数据库操作，不使用框架，我们需要自己写sql语句建表，在进行数据库操作时每次都要进行连接，写select语句查询数据等等。Model就是MVC架构中的M层，主要负责与数据库的交互

#### 数据库配置
数据库在`/.env`文件配置，我的Laravel版本为5.2，好像较早之前版本的配置在`/config/database.php`中配置。当前版本打开这个文件可以看到它是从`/.env`中读取数据的
配置较为简单，database类型、host、port、database、username、password

#### 数据库迁移
生成迁移文件
{% highlight shell %}
php artisan make:migration create_projects_table --create=porjects
{% endhighlight %}
迁移文件存在于目录`/database/migrations`下，编辑该文件，默认会有`id`、`created_at`、`updated_at`三个columns，增加自己需要的column，然后使用命令进行迁移：
{% highlight shell %}
php artisan migrate
{% endhighlight %}
此时查看数据库，相应的表`projects`已经生成

#### 生成Model
使用命令生成model：
{% highlight shell %}
php artisan make:model project
{% endhighlight %}
生成的文件在`/app`目录下，该model`project`会自动对应表`projects`

>未完待续...