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