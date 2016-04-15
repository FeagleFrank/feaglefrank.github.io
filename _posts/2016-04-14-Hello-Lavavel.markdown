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
生成的文件在`/app`目录下，该model`project`会自动对
应表`projects`

## 路由

#### 路由配置
路由的配置在`/app/HTTP/routes.php`中，打开后看到默认有一条路由信息
{% highlight php %}
Route::get('/', function () {
    return view('welcome');
});
{% endhighlight %}
以Get方式访问根目录，返回welcome视图，get可以替换为post、delete或者any等等，我在配置路由时还遇到了一个问题，路由配置如下：
{% highlight php %}
Route::get('/', function () {
    return view('welcome');
});
Route::get('/mis', function () {
    return 'Hello';
});
{% endhighlight %}
我访问 `http://host/ts`时（ts为项目目录），可正常看到welcome视图，而当我访问`http://host/ts/mis`时，却是404，起初还以为还是apache rewrite的问题，调了很久还是不行，后来才发现，Laravel是以`/server.php`文件为入口，指向`/public/index.php`，而我的apache的根目录设置的是该Laravel项目的根目录，一般将根目录设置为`/public`就不会出现该问题，或者也可直接访问为`http://host/ts/server.php/mis`

#### 路由组
路由组主要是用来组合路由，同意添加命名空间、中间件等功能的，实现如下
{% highlight php %}
Route::group(['prefix'=>'mis','namespace'=>'mis'],function(){
    Route::get('/','misController@index');
    Route::post('/addProject','misController@addProject');
});
{% endhighlight %}
其中Route方法的第二个参数为misController指定的控制器，@之后的为该控制器的方法

## Controller
Controller为MVC架构中的C——控制器，使用命令生成控制器：
{% highlight shell %}
php artisan make:controller mis/misController
});
{% endhighlight %}
生成的文件在/app/HTTP/Controllers下，添加方法
{% highlight php %}
<?php

namespace App\Http\Controllers\mis;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Project;
use Illuminate\Support\Facades\Input;

class misController extends Controller
{
   public function index(){
       return view('mis/index');
   }
    
    public function addProject(Request $request){
        $project = new Project;
        $project->name = Input::get('name');
        $project->save();
    }
}
{% endhighlight %}

## View
View为MVC中的V——视图层，目录在`\resources\views`。Laravel的View采用了Blade的模板引擎，你可以写个layout
{% highlight html %}
<!DOCTYPE HTML>
<html>
    <head>
    
    </head>
    <body>
        @yield('content')
    </body>
</html>
{% endhighlight %}
使用以下方式使用该模板
{% highlight html %}
@extends('layouts.mis')

@section('content')

<div>
    <form action="{{ URL('mis/addProject') }}" method="post">
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
        <input type="text" name="name">
        <button type="submit">AddProject</button>
    </form>
    
</div>
{% endhighlight %}
其中`<input type="hidden" name="_token" value="{{ csrf_token() }}">`是为防止CSRF跨站请求伪造，如果不加这一句，提交表单时会报错，或者也可将Laravel的CSRF token禁用，当然，不建议这么做

## 总结
这就是搭建Laravel框架的基本过程，我也是初学者，没有学得很深奥。将来遇到一些问题、心得，也会分享给大家
