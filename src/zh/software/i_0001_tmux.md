# Linux的Tmux会话

Tmux是一个终端复用器（terminal multiplexer），属于常用的[开发工具](https://so.csdn.net/so/search?q=%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7&spm=1001.2101.3001.7020)，学会了之后可以大大的提高工作效率。

## 会话与进程

命令行的典型使用方式是，打开一个终端窗口（terminal window，以下简称"窗口"），在里面输入命令。用户与计算机的这种临时的交互，称为一次"会话"（session）

会话的一个重要特点是，窗口与其中启动的进程是连在一起的。打开窗口，会话开始；关闭窗口，会话结束，会话内部的进程也会随之终止，不管有没有运行完

一个典型的例子就是，SSH 登录远程计算机，打开一个远程窗口执行命令。这时，网络突然断线，再次登录的时候，是找不回上一次执行的命令的。因为上一次 SSH 会话已经终止了，里面的进程也随之消失了

为了解决这个问题，会话与窗口可以"解绑"：窗口关闭时，会话并不终止，而是继续运行，等到以后需要的时候，再让会话"绑定"其他窗口。

## Tmux 的作用

Tmux 就是会话与窗口的"解绑"工具，将它们彻底分离。

（1）它允许在单个窗口中，同时访问多个会话。这对于同时运行多个命令行程序很有用。

（2） 它可以让新窗口"接入"已经存在的会话。

（3）它允许每个会话有多个连接窗口，因此可以多人实时共享会话。 （4）它还支持窗口任意的垂直和水平拆分。

## Tmux 的最简操作流程

* 新建会话 tmux new -s my\_session
* 在 Tmux 窗口运行所需的程序
* 按下快捷键 Ctrl+b d 将会话分离
* 下次使用时，重新连接到会话 tmux attach-session -t my\_session

## 安装 Tmux

```bash
# Ubuntu 或 Debian
$ sudo apt-get install tmux

# CentOS 或 Fedora
$ sudo yum install tmux

# Mac
$ brew install tmux

```

## Tmux 会话快捷键

* Ctrl+b d：分离当前会话
* Ctrl+b s：列出所有会话
* Ctrl+b \$：重命名当前会话

## Tmux 操作命令

```bash
# 按下Ctrl+d或者显式输入exit命令，就可以退出 Tmux 窗口。

# 会话列表
tmux ls

# 新建会话
tmux new -s <session-name>    #新建一个指定名称的会话。
tmux new -s 'linzhiping'

# 分离会话
# 在 Tmux 窗口中，按下Ctrl+b d或者输入tmux detach命令，就会将当前会话与窗口分离
tmux detach

# 接入会话--------------------
# 使用会话编号
tmux attach -t 0

# 使用会话名称
tmux attach -t <session-name>
tmux attach -t 'linzhiping'

# 关闭会话（在会话中使用Ctrl+d可以关闭）
# 使用会话编号-关闭会话
tmux kill-session -t 0

# 使用会话名称-关闭会话
tmux kill-session -t <session-name>
tmux kill-session -t 'linzhiping'

# 切换会话
# 使用会话编号-切换会话
tmux switch -t 0

# 使用会话名称-切换会话
tmux switch -t <session-name>
tmux switch -t 'linzhiping'

# 重命名会话
tmux rename-session -t 0 <new-name>
# xxx代表会话编号
tmux rename-session -t xxx <new-name>




```

## Tmux相关资料

* [Linux里会话窗口指令Tmux和Screen安装使用介绍Ubuntu系统](https://www.ctyun.cn/zhishi/p-495254)

* [tmux用于linux服务器后台运行程序](https://blog.csdn.net/lf_78910jqk/article/details/127693565?ops_request_misc=&request_id=&biz_id=102&utm_term=Linux%E5%91%BD%E4%BB%A4%E4%B9%8BTmux&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-7-127693565.142^v102^pc_search_result_base9&spm=1018.2226.3001.4187)

* [Linux常用命令之Tmux](https://blog.csdn.net/weixin_30732487/article/details/98707342?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522d27c1ba4f04138e3d399593f489e7661%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=d27c1ba4f04138e3d399593f489e7661&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticSearch~search_v2-6-98707342-null-null.142^v102^pc_search_result_base9&utm_term=Linux%E5%91%BD%E4%BB%A4%E4%B9%8BTmux&spm=1018.2226.3001.4187)





