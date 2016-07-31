---
layout: post
title: "Laravel 笔记"
category: PHP
---

## 编辑数据库 ##
{% highlight shell %}
php artisan migrate:rollback
php artisan migrate
{% endhighlight %}

## 数据库填充 ##
如果想在数据库中插入默认数据，可以使用数据库填充功能
```/database/seeds```目录下新建类```ProjectTableSeede```
{% highlight shell %}
class ProjectTableSeeder extends Seeder{
    public function run(){
        for($i=0;$i<5;$i++) {
            Project::create([
                'name' => 'Project'.$i,
                'parent_id'=> 0,
                'status' => 0,
                'description' => 'NO.'.$i,
                'start_time' => date('Y-m-d H:i;s',time()),
            ]);
        }
    }
}
{% endhighlight %}

修改DatabaseSeeder文件中的run方法，增加如下语句，调用```ProjectTableSeeder```类
{% highlight shell %}
$this->call('ProjectTableSeeder');
{% endhighlight %}

增加了类后，一定需要使用```compsoer dump-autoload```来更新文件
然后使用```php artisan db:seed```来进行填充

在数据库迁移时，也可直接使用命令```php artisan migrate --seed```来进行迁移并填充

## 清除视图缓存 ##
修改View后，刷新页面发现并没有变化，是由于视图缓存导致的，需要将其清除：
{% highlight shell %}
php artisan view：clear
{% endhighlight %}

清除目录```/storage/framwork/views```下的缓存视图
暂时还未找到停止view cache的方法，试了stackoverflow上的几种方法，都没成功0.0

============2016/7/31更新==============

## 数据库连接错误 ##
数据库连接时出现PDOEXCEPTION，如果配置未出现异常，连接的事MYSQL，可能是PHP缺少了PDO_MYSQL扩展

此外，还出现过找不到表的情况，排查后发现是由于Laravel会大写表名的第一个字母，如果数据库大小写敏感，则会出现问题
解决方法：
找到MYSQL配置文件```/etc/mysql/my.conf```
在[mysqlId]下添加如下代码
{% highlight shell %}
lower_case_table_names=1
{% endhighlight %}

## 数据库反向迁移 ##
对于已存在的表，可以进行反向迁移，生成迁移文件
使用了Laravel Migrations Generator，GITHUB地址```https://github.com/Xethron/migrations-generator```
使用方法：
{% highlight shell %}
composer require --dev --no-update "xethron/migrations-generator:dev-l5"
composer require --dev --no-update "way/generators:dev-feature/laravel-five-stable"
composer config repositories.repo-name git "git@github.com:jamisonvalenta/Laravel-4-Generators.git"
composer update
{% endhighlight %}

在```/config/app.php```添加provider：
{% highlight shell %}
Way\Generators\GeneratorsServiceProvider::class,
Xethron\MigrationsGenerator\MigrationsGeneratorServiceProvider::class,
{% endhighlight %}

然后使用命令```php artisan migrate:generate table```就可以进行反向迁移，生成迁移文件
